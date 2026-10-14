import test from "node:test";
import assert from "node:assert/strict";
import { validateEmailSyntax, resolveDomainMX, validateEmail } from "../src/services/emailValidator.js";
import { validatePhoneNumber } from "../src/services/phoneValidator.js";

// ==========================================
// 1. EMAIL SYNTAX TESTS
// ==========================================
test("Email Syntax - Rejects malformed addresses", () => {
  const malformed = [
    "abc",
    "abc@",
    "@ gmail.com",
    "@gmail.com",
    "abc@ ",
    "abc..def@gmail.com",
    ".abc@gmail.com",
    "abc.@gmail.com",
    "abc@domain..com",
    "abc@domain",
    "abc@.com",
    "",
    null,
    undefined,
  ];

  for (const input of malformed) {
    const res = validateEmailSyntax(input);
    assert.equal(res.valid, false, `Expected ${input} to be invalid`);
  }
});

test("Email Syntax - Accepts well-formed email addresses", () => {
  const valid = [
    "user@example.com",
    "firstname.lastname@domain.co.uk",
    "user+tag@domain.org",
    "customer123@shopzone.in",
  ];

  for (const input of valid) {
    const res = validateEmailSyntax(input);
    assert.equal(res.valid, true, `Expected ${input} to be valid syntax`);
    assert.ok(res.localPart);
    assert.ok(res.domain);
  }
});

// ==========================================
// 2. EMAIL DOMAIN & MX TESTS
// ==========================================
test("Email Domain - Detects nonexistent domains without mail servers", async () => {
  const res = await resolveDomainMX("thisdomaindoesnotexist9876543210.xyz");
  assert.equal(res.hasMailServer, false);
  assert.equal(res.mxRecords.length, 0);

  const fullRes = await validateEmail("test@thisdomaindoesnotexist9876543210.xyz");
  assert.equal(fullRes.valid, false);
  assert.equal(fullRes.status, "invalid");
});

test("Email Domain - Resolves MX records for known domains", async () => {
  const res = await resolveDomainMX("gmail.com");
  assert.equal(res.hasMailServer, true);
  assert.ok(res.mxRecords.length > 0);
  assert.ok(res.mxRecords[0].exchange);
});

// ==========================================
// 3. EMAIL DELIVERABILITY & UNCERTAINTY TESTS
// ==========================================
test("Email Deliverability - Accurately returns 'unknown' for anti-enumeration providers", async () => {
  // Gmail intentionally prevents recipient enumeration and greylists/accepts handshake
  const res = await validateEmail("someuser@gmail.com");
  assert.equal(res.valid, false);
  assert.equal(res.status, "unknown");
  assert.match(res.reason, /Mailbox existence could not be reliably determined/i);
});

// ==========================================
// 4. INTERNATIONAL PHONE VALIDATION TESTS
// ==========================================
test("Phone Validation - Validates Indian mobile numbers", () => {
  // Valid Indian mobile
  const validIn = validatePhoneNumber("+919876543210");
  assert.equal(validIn.valid, true);
  assert.equal(validIn.status, "valid");
  assert.equal(validIn.country, "IN");
  assert.equal(validIn.countryCallingCode, "91");
  assert.equal(validIn.type, "MOBILE");

  // Invalid Indian mobile (all zeroes / non-existent prefix)
  const invalidIn = validatePhoneNumber("+910000000000");
  assert.equal(invalidIn.valid, false);
  assert.equal(invalidIn.status, "invalid");
});

test("Phone Validation - Validates US phone numbers", () => {
  // Valid US number (San Francisco area code 415)
  const validUS = validatePhoneNumber("+14155552671");
  assert.equal(validUS.valid, true);
  assert.equal(validUS.status, "valid");
  assert.equal(validUS.country, "US");
  assert.equal(validUS.countryCallingCode, "1");

  // Too short
  const invalidUS = validatePhoneNumber("12345", "US");
  assert.equal(invalidUS.valid, false);
  assert.equal(invalidUS.status, "invalid");
});

test("Phone Validation - Validates UK mobile numbers", () => {
  // Valid UK mobile
  const validUK = validatePhoneNumber("+447912345678");
  assert.equal(validUK.valid, true);
  assert.equal(validUK.status, "valid");
  assert.equal(validUK.country, "GB");
  assert.equal(validUK.countryCallingCode, "44");
  assert.equal(validUK.type, "MOBILE");
});

test("Phone Validation - Validates Australian mobile numbers", () => {
  // Valid Australian mobile (+61 4...)
  const validAU = validatePhoneNumber("+61412345678");
  assert.equal(validAU.valid, true);
  assert.equal(validAU.status, "valid");
  assert.equal(validAU.country, "AU");
  assert.equal(validAU.countryCallingCode, "61");
  assert.equal(validAU.type, "MOBILE");
});

test("Phone Validation - Rejects clearly invalid numbers and strings", () => {
  const invalidCases = [
    "+999123456789", // Invalid country calling code 999
    "abcdef",        // Non-numeric
    "",              // Empty
    "   ",           // Spaces only
    "+91",           // Prefix only
    "123",           // Too short
  ];

  for (const item of invalidCases) {
    const res = validatePhoneNumber(item);
    assert.equal(res.valid, false, `Expected ${item} to be invalid`);
    assert.equal(res.status, "invalid");
  }
});

// ==========================================
// 5. API ENDPOINTS INTEGRATION TESTS
// ==========================================
import express from "express";
import validateRoutes from "../src/routes/validateRoutes.js";

test("API Endpoints - POST /api/validate/email handles valid and invalid requests", async () => {
  const app = express();
  app.use(express.json());
  app.use("/api/validate", validateRoutes);
  const server = app.listen(0);
  const port = server.address().port;

  try {
    // Missing email
    let res = await fetch(`http://127.0.0.1:${port}/api/validate/email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    assert.equal(res.status, 400);
    let body = await res.json();
    assert.equal(body.valid, false);
    assert.equal(body.status, "invalid");

    // Malformed syntax email
    res = await fetch(`http://127.0.0.1:${port}/api/validate/email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "abc@.com" }),
    });
    assert.equal(res.status, 200);
    body = await res.json();
    assert.equal(body.valid, false);
    assert.equal(body.status, "invalid");

    // Well-formed email
    res = await fetch(`http://127.0.0.1:${port}/api/validate/email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "user@example.com" }),
    });
    assert.equal(res.status, 200);
    body = await res.json();
    assert.ok(typeof body.valid === "boolean");
    assert.ok(["valid", "invalid", "unknown"].includes(body.status));
    assert.ok(body.reason);
  } finally {
    server.close();
  }
});

test("API Endpoints - POST /api/validate/phone handles valid and invalid requests", async () => {
  const app = express();
  app.use(express.json());
  app.use("/api/validate", validateRoutes);
  const server = app.listen(0);
  const port = server.address().port;

  try {
    // Missing phone
    let res = await fetch(`http://127.0.0.1:${port}/api/validate/phone`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    assert.equal(res.status, 400);
    let body = await res.json();
    assert.equal(body.valid, false);

    // Valid international phone
    res = await fetch(`http://127.0.0.1:${port}/api/validate/phone`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: "+919876543210" }),
    });
    assert.equal(res.status, 200);
    body = await res.json();
    assert.equal(body.valid, true);
    assert.equal(body.status, "valid");
    assert.equal(body.country, "IN");
    assert.equal(body.countryCallingCode, "91");
    assert.equal(body.type, "MOBILE");

    // Invalid phone
    res = await fetch(`http://127.0.0.1:${port}/api/validate/phone`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: "+910000000000" }),
    });
    assert.equal(res.status, 200);
    body = await res.json();
    assert.equal(body.valid, false);
    assert.equal(body.status, "invalid");
  } finally {
    server.close();
  }
});
