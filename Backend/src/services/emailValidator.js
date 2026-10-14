import dnsPromises from "node:dns/promises";
import dns from "node:dns";
import net from "node:net";
import crypto from "node:crypto";

// Ensure reliable DNS resolution if local resolver is loopback without running daemon
try {
  const current = dns.getServers();
  const isLoopbackOnly = !current || current.length === 0 || current.every((s) => s === "127.0.0.1" || s === "::1" || s === "0.0.0.0");
  if (isLoopbackOnly) {
    dns.setServers(["8.8.8.8", "1.1.1.1", "8.8.4.4"]);
  }
} catch {
  // ignore if restricted
}

// Simple in-memory LRU/TTL cache for domain MX lookups
const domainCache = new Map();
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

// Well-known mail providers that intentionally prevent mailbox enumeration
// (They either accept all RCPT TO commands during handshake or block residential/cloud IPs)
const ENUMERATION_PROTECTED_DOMAINS = new Set([
  "gmail.com",
  "googlemail.com",
  "outlook.com",
  "hotmail.com",
  "live.com",
  "yahoo.com",
  "ymail.com",
  "icloud.com",
  "me.com",
  "mac.com",
  "aol.com",
  "proton.me",
  "protonmail.com",
  "zoho.com",
]);

/**
 * Validates syntax of an email address strictly according to RFC 5322 rules.
 *
 * @param {string} email
 * @returns {{ valid: boolean, reason?: string, localPart?: string, domain?: string }}
 */
export function validateEmailSyntax(email) {
  if (!email || typeof email !== "string") {
    return { valid: false, reason: "Email is required" };
  }

  const trimmed = email.trim();

  // Enforce overall length limit (RFC 5321: max 254 chars)
  if (trimmed.length < 3 || trimmed.length > 254) {
    return { valid: false, reason: "Email address length is invalid" };
  }

  // Must have exactly one @ separating local and domain
  const atCount = (trimmed.match(/@/g) || []).length;
  if (atCount !== 1) {
    return { valid: false, reason: "Email must contain exactly one @ symbol" };
  }

  // Reject spaces anywhere in the address
  if (/\s/.test(trimmed)) {
    return { valid: false, reason: "Email address cannot contain spaces" };
  }

  const [localPart, domain] = trimmed.split("@");

  // Local part checks (RFC 5321: max 64 chars)
  if (!localPart || localPart.length === 0 || localPart.length > 64) {
    return { valid: false, reason: "Email username (local part) is invalid or too long" };
  }

  // Reject leading/trailing dots and consecutive dots in local part
  if (localPart.startsWith(".") || localPart.endsWith(".") || localPart.includes("..")) {
    return { valid: false, reason: "Email username cannot start, end, or have consecutive dots" };
  }

  // Valid local-part characters
  const localPartRegex = /^[a-zA-Z0-9!#$%&'*+/=?^_`{|}~.-]+$/;
  if (!localPartRegex.test(localPart)) {
    return { valid: false, reason: "Email username contains invalid characters" };
  }

  // Domain checks (RFC 1035: max 255 chars)
  if (!domain || domain.length === 0 || domain.length > 255) {
    return { valid: false, reason: "Email domain name is invalid or too long" };
  }

  if (domain.startsWith(".") || domain.endsWith(".") || domain.includes("..")) {
    return { valid: false, reason: "Email domain cannot start, end, or contain consecutive dots" };
  }

  // Domain must have at least one dot and valid TLD of at least 2 chars
  const domainParts = domain.split(".");
  if (domainParts.length < 2) {
    return { valid: false, reason: "Email domain must include a top-level domain (e.g. .com)" };
  }

  const tld = domainParts[domainParts.length - 1];
  if (!/^[a-zA-Z]{2,}$/.test(tld)) {
    return { valid: false, reason: "Email top-level domain is invalid" };
  }

  for (const part of domainParts) {
    if (part.length === 0 || part.length > 63) {
      return { valid: false, reason: "Domain labels must be between 1 and 63 characters" };
    }
    if (part.startsWith("-") || part.endsWith("-")) {
      return { valid: false, reason: "Domain labels cannot start or end with a hyphen" };
    }
    if (!/^[a-zA-Z0-9-]+$/.test(part)) {
      return { valid: false, reason: "Domain contains invalid characters" };
    }
  }

  return {
    valid: true,
    localPart: localPart.toLowerCase(),
    domain: domain.toLowerCase(),
    normalized: `${localPart.toLowerCase()}@${domain.toLowerCase()}`,
  };
}

/**
 * Checks if an IP address is private, loopback, link-local, or reserved (SSRF protection).
 *
 * @param {string} ip
 * @returns {boolean}
 */
function isPrivateOrReservedIP(ip) {
  if (!ip) return true;

  // IPv4 checks
  if (net.isIPv4(ip)) {
    const parts = ip.split(".").map(Number);
    // 0.0.0.0/8 (Current network)
    if (parts[0] === 0) return true;
    // 10.0.0.0/8 (Private)
    if (parts[0] === 10) return true;
    // 127.0.0.0/8 (Loopback)
    if (parts[0] === 127) return true;
    // 169.254.0.0/16 (Link-local)
    if (parts[0] === 169 && parts[1] === 254) return true;
    // 172.16.0.0/12 (Private)
    if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return true;
    // 192.168.0.0/16 (Private)
    if (parts[0] === 192 && parts[1] === 168) return true;
    // 224.0.0.0/4 (Multicast) & 240.0.0.0/4 (Reserved)
    if (parts[0] >= 224) return true;
    return false;
  }

  // IPv6 checks
  if (net.isIPv6(ip)) {
    const lower = ip.toLowerCase();
    if (lower === "::1" || lower === "::") return true;
    if (lower.startsWith("fc") || lower.startsWith("fd")) return true; // Unique local
    if (lower.startsWith("fe80")) return true; // Link-local
    return false;
  }

  return true;
}

/**
 * Resolves MX records for a domain with caching and fallback.
 *
 * @param {string} domain
 * @returns {Promise<{ hasMailServer: boolean, mxRecords: Array<{ exchange: string, priority: number }> }>}
 */
export async function resolveDomainMX(domain) {
  const cached = domainCache.get(domain);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }

  try {
    // Resolve MX records with a DNS timeout
    const mxRecords = await Promise.race([
      dnsPromises.resolveMx(domain),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("DNS resolution timed out")), 3000)
      ),
    ]);

    if (mxRecords && mxRecords.length > 0) {
      // Sort by priority ascending (lower value = higher priority)
      mxRecords.sort((a, b) => a.priority - b.priority);
      const result = { hasMailServer: true, mxRecords };
      domainCache.set(domain, { timestamp: Date.now(), data: result });
      return result;
    }
  } catch (err) {
    // If no MX record, RFC 5321 specifies falling back to A record
    if (err.code === "ENODATA" || err.code === "ENOTFOUND") {
      try {
        const aRecords = await dnsPromises.resolve4(domain);
        if (aRecords && aRecords.length > 0) {
          const result = {
            hasMailServer: true,
            mxRecords: [{ exchange: domain, priority: 0 }],
          };
          domainCache.set(domain, { timestamp: Date.now(), data: result });
          return result;
        }
      } catch {
        // Fallback also failed
      }
    }
  }

  const notFound = { hasMailServer: false, mxRecords: [] };
  domainCache.set(domain, { timestamp: Date.now(), data: notFound });
  return notFound;
}

/**
 * Communicates with an MX server over SMTP to test mailbox deliverability.
 * Never sends a real email (no DATA command).
 *
 * @param {string} mxHost
 * @param {string} email
 * @param {string} domain
 * @returns {Promise<{ status: "valid" | "invalid" | "unknown", reason: string }>}
 */
async function checkSmtpDeliverability(mxHost, email, domain) {
  // Resolve MX host IP to ensure it's safe (SSRF protection)
  let mxIp;
  try {
    const ips = await dnsPromises.resolve4(mxHost);
    mxIp = ips[0];
  } catch {
    return {
      status: "unknown",
      reason: "Could not resolve mail exchange server address",
    };
  }

  if (isPrivateOrReservedIP(mxIp)) {
    return {
      status: "invalid",
      reason: "Mail exchange server address is unroutable or private",
    };
  }

  // If the domain is a known anti-enumeration provider (e.g. Gmail, Outlook, Yahoo),
  // SMTP will either block connection, greylist, or accept every recipient regardless of existence.
  // We accurately report 'unknown' rather than falsely guessing.
  if (ENUMERATION_PROTECTED_DOMAINS.has(domain)) {
    return {
      status: "unknown",
      reason: "Mailbox existence could not be reliably determined (provider prevents recipient enumeration)",
    };
  }

  return new Promise((resolve) => {
    const timeoutMs = 3500;
    let socket;
    let settled = false;

    const cleanupAndResolve = (result) => {
      if (settled) return;
      settled = true;
      try {
        if (socket && !socket.destroyed) {
          socket.write("RSET\r\nQUIT\r\n");
          socket.end();
          socket.destroy();
        }
      } catch {
        // ignore cleanup error
      }
      resolve(result);
    };

    const timer = setTimeout(() => {
      cleanupAndResolve({
        status: "unknown",
        reason: "Mailbox existence could not be reliably determined (SMTP server timed out)",
      });
    }, timeoutMs);

    try {
      socket = net.createConnection({ host: mxIp, port: 25 });
      socket.setTimeout(timeoutMs);
      socket.setEncoding("utf8");

      let buffer = "";
      let step = 0; // 0: wait banner, 1: EHLO, 2: MAIL FROM, 3: RCPT TO, 4: Catch-all RCPT TO

      const randomCheckAddress = `nonexistent_${crypto.randomBytes(6).toString("hex")}@${domain}`;

      socket.on("data", (chunk) => {
        buffer += chunk;
        const lines = buffer.split("\n");

        for (let i = 0; i < lines.length - 1; i++) {
          const line = lines[i].trim();
          if (!line) continue;

          // SMTP multi-line replies have a hyphen after the code (e.g. 250-something)
          // Final reply line has space after the code (e.g. 250 OK)
          const isFinal = /^\d{3}\s/.test(line);
          const code = parseInt(line.substring(0, 3), 10);

          if (!isFinal) continue;

          // Step 0: Greeting banner received
          if (step === 0) {
            if (code === 220) {
              step = 1;
              socket.write("HELO mail.shopzone.com\r\n");
            } else {
              clearTimeout(timer);
              cleanupAndResolve({
                status: "unknown",
                reason: "Mailbox existence could not be reliably determined (SMTP banner rejected)",
              });
              return;
            }
          }
          // Step 1: HELO response received
          else if (step === 1) {
            if (code === 250) {
              step = 2;
              socket.write("MAIL FROM:<verify@shopzone.com>\r\n");
            } else {
              clearTimeout(timer);
              cleanupAndResolve({
                status: "unknown",
                reason: "Mailbox existence could not be reliably determined",
              });
              return;
            }
          }
          // Step 2: MAIL FROM response received
          else if (step === 2) {
            if (code === 250) {
              step = 3;
              socket.write(`RCPT TO:<${email}>\r\n`);
            } else {
              clearTimeout(timer);
              cleanupAndResolve({
                status: "unknown",
                reason: "Mailbox existence could not be reliably determined",
              });
              return;
            }
          }
          // Step 3: Target RCPT TO response received
          else if (step === 3) {
            if (code >= 550 && code <= 554) {
              // Mailbox explicitly rejected by receiving server
              clearTimeout(timer);
              cleanupAndResolve({
                status: "invalid",
                reason: "Mailbox rejected by receiving mail server",
              });
              return;
            } else if (code === 250 || code === 251) {
              // Recipient accepted: perform a catch-all probe to verify if server accepts everything
              step = 4;
              socket.write(`RCPT TO:<${randomCheckAddress}>\r\n`);
            } else {
              // 4xx temporary failure, greylisting, or unexpected code
              clearTimeout(timer);
              cleanupAndResolve({
                status: "unknown",
                reason: "Mailbox existence could not be reliably determined",
              });
              return;
            }
          }
          // Step 4: Catch-all check response received
          else if (step === 4) {
            clearTimeout(timer);
            if (code === 250 || code === 251) {
              // The server accepted a known-random address -> Catch-all domain!
              cleanupAndResolve({
                status: "unknown",
                reason: "Mailbox existence could not be reliably determined (catch-all domain)",
              });
            } else {
              // Random address rejected, but target was accepted -> Genuine mailbox exists!
              cleanupAndResolve({
                status: "valid",
                reason: "Mailbox appears deliverable",
              });
            }
            return;
          }
        }
        buffer = lines[lines.length - 1];
      });

      socket.on("error", () => {
        clearTimeout(timer);
        cleanupAndResolve({
          status: "unknown",
          reason: "Mailbox existence could not be reliably determined",
        });
      });

      socket.on("timeout", () => {
        clearTimeout(timer);
        cleanupAndResolve({
          status: "unknown",
          reason: "Mailbox existence could not be reliably determined (connection timed out)",
        });
      });
    } catch {
      clearTimeout(timer);
      cleanupAndResolve({
        status: "unknown",
        reason: "Mailbox existence could not be reliably determined",
      });
    }
  });
}

/**
 * Main Progressive Email Validation Service.
 * Performs:
 * 1. Strict Syntax validation (RFC 5322)
 * 2. Domain & DNS MX record resolution
 * 3. SSRF prevention
 * 4. SMTP mailbox existence / deliverability check with uncertainty handling
 *
 * @param {string} rawEmail
 * @returns {Promise<{ valid: boolean, status: "valid" | "invalid" | "unknown", reason: string }>}
 */
export async function validateEmail(rawEmail) {
  // Step 1: Syntax Validation
  const syntaxCheck = validateEmailSyntax(rawEmail);
  if (!syntaxCheck.valid) {
    return {
      valid: false,
      status: "invalid",
      reason: syntaxCheck.reason || "Invalid email address syntax",
    };
  }

  const { domain, normalized } = syntaxCheck;

  // Step 2: Domain & DNS MX validation
  let mxResult;
  try {
    mxResult = await resolveDomainMX(domain);
  } catch {
    return {
      valid: false,
      status: "invalid",
      reason: "Domain does not exist or has no mail servers",
    };
  }

  if (!mxResult.hasMailServer || mxResult.mxRecords.length === 0) {
    return {
      valid: false,
      status: "invalid",
      reason: "Domain does not have valid mail exchange (MX) infrastructure",
    };
  }

  // Step 3: Mailbox Deliverability / Existence Check via SMTP
  const primaryMX = mxResult.mxRecords[0].exchange;
  const deliverability = await checkSmtpDeliverability(primaryMX, normalized, domain);

  return {
    valid: deliverability.status === "valid",
    status: deliverability.status,
    reason: deliverability.reason,
  };
}
