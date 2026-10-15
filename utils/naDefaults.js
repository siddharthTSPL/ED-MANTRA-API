// Candidate (ATS) ke text fields jo blank hone par "NA" save hone chahiye.
// NOTE: phone ko jaan-boojh kar include nahi kiya (DB me unique hai, "NA" 2 baar save nahi hoga).
// File fields (aadhar/resume/agreement/photo) bhi include nahi hain, warna download link toot jayega.
const NA_FIELDS = [
  "firstName",
  "lastName",
  "gender",
  "maritalStatus",
  "email",
  "dob",
  "highestQualification",
  "otherQualification",
  "experience",
  "sector",
  "role",
  "keySkills",
  "employer",
  "designation",
  "yearsOfExperience",
  "monthsOfExperience",
  "currentCTC",
  "expectedCTC",
  "registeredDate",
  "source",
  "personName",
  "personContact",
  "residentialAddress",
  "residentialCity",
  "mailingAddress",
  "mailingCity",
];

const NA = "NA";

const isBlank = (value) => {
  if (value === undefined || value === null) return true;
  if (typeof value === "string") {
    const v = value.trim().toLowerCase();
    return v === "" || v === "null" || v === "undefined";
  }
  return false;
};

const isBlankLanguage = (value) => {
  if (isBlank(value)) return true;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === "string") {
    const v = value.trim();
    return v === "[]" || v === '""';
  }
  return false;
};

/**
 * Blank fields ko "NA" bana deta hai.
 * @param {object} data   - candidate data
 * @param {object} opts
 * @param {boolean} opts.onlyIfPresent - true (update ke liye): jo field request me aayi hi nahi
 *                                       use touch nahi karega, sirf bheji gayi blank field ko NA karega.
 */
const applyNA = (data, { onlyIfPresent = false } = {}) => {
  const out = { ...data };

  // phone unique hai -> blank ho to "" / "NA" nahi, null hi rahe (multiple null allowed hain)
  if (out.phone !== undefined) {
    out.phone = isBlank(out.phone) ? null : String(out.phone).trim();
  }

  NA_FIELDS.forEach((field) => {
    if (onlyIfPresent && out[field] === undefined) return;
    if (isBlank(out[field])) out[field] = NA;
    else if (typeof out[field] === "string") out[field] = out[field].trim();
  });

  if (!(onlyIfPresent && out.language === undefined)) {
    if (isBlankLanguage(out.language)) out.language = [NA]; // JSONB column
  }

  return out;
};

module.exports = { applyNA, NA_FIELDS, NA, isBlank };