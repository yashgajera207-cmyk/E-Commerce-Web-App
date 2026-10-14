import { parsePhoneNumber } from "libphonenumber-js/max";

/**
 * Validates an international telephone number against international numbering plan rules.
 * Does NOT check ownership or send OTPs.
 *
 * @param {string} rawPhone - Raw phone number string (e.g., "+919876543210", "+14155552671")
 * @param {string} [defaultCountry="IN"] - Default ISO-3166-1 alpha-2 country code if no "+" prefix
 * @returns {object} Validation result object
 */
export function validatePhoneNumber(rawPhone, defaultCountry = "IN") {
  try {
    if (!rawPhone || typeof rawPhone !== "string") {
      return {
        valid: false,
        status: "invalid",
        reason: "Phone number is required",
      };
    }

    const trimmed = rawPhone.trim();

    // Security & length limits: international E.164 max is 15 digits; allow reasonable formatting chars
    if (trimmed.length < 3 || trimmed.length > 30) {
      return {
        valid: false,
        status: "invalid",
        reason: "Invalid telephone number length",
      };
    }

    // Must contain numeric digits and only standard phone characters (+, digits, spaces, hyphens, parens)
    if (!/^[+0-9\s\-().]+$/.test(trimmed)) {
      return {
        valid: false,
        status: "invalid",
        reason: "Invalid telephone number format",
      };
    }

    // Parse using libphonenumber-js metadata
    let phoneNumber;
    try {
      phoneNumber = parsePhoneNumber(trimmed, defaultCountry);
    } catch {
      return {
        valid: false,
        status: "invalid",
        reason: "Invalid telephone number",
      };
    }

    if (!phoneNumber) {
      return {
        valid: false,
        status: "invalid",
        reason: "Invalid telephone number",
      };
    }

    // Check numbering plan rules: must be both structurally possible and valid according to national numbering plan
    const isPossible = phoneNumber.isPossible();
    const isValid = phoneNumber.isValid();

    if (!isPossible || !isValid) {
      return {
        valid: false,
        status: "invalid",
        reason: "Invalid telephone number",
      };
    }

    const country = phoneNumber.country || null;
    const countryCallingCode = phoneNumber.countryCallingCode || null;
    const type = phoneNumber.getType() || "UNKNOWN";

    return {
      valid: true,
      status: "valid",
      country,
      countryCallingCode,
      type,
      formatted: phoneNumber.formatInternational(),
      nationalNumber: phoneNumber.nationalNumber,
    };
  } catch (err) {
    return {
      valid: false,
      status: "invalid",
      reason: "Invalid telephone number",
    };
  }
}
