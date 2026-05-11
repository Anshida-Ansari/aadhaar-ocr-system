export const AADHAAR_NUMBER_REGEX = /\d{4}\s\d{4}\s\d{4}/;
export const DOB_REGEX = /DOB\s*[:：]?\s*(\d{2}[-/]\d{2}[-/]\d{4})/i;
export const GENDER_REGEX = /(Male|Female|Transgender)/i;
export const PINCODE_REGEX = /\d{6}/;
export const ADDRESS_SKIP_PATTERNS = [
  /government/i,
  /india/i,
  /aadhaar/i,
  /uid/i
];
