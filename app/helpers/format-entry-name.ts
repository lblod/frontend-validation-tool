import { helper } from '@ember/component/helper';

export default helper(function formatEntryName([str] /*, named*/) {
  if (typeof str !== 'string') {
    return str; // Return the input as-is if it's not a string.
  }

  // Split string at every uppercase letter, lowercase everything, and join with spaces remove the word "shape" from the string.
  const transformed =
    str.startsWith('http') || str.startsWith('https')
      ? str
      : str
          .split(/(?=[A-Z])/) // Split at uppercase letters to handle camelCase
          .filter((s) => s.toLowerCase() !== 'shape') // Remove any segments that are exactly 'shape'
          .map((s) => s.toLowerCase()) // Convert all segments to lowercase
          .join(' '); // Join the segments into a single string with spaces

  // Capitalize the first letter of the resulting string only if it's not a link.
  const result =
    str.startsWith('http') || str.startsWith('https')
      ? transformed
      : transformed.charAt(0).toUpperCase() + transformed.slice(1);

  return result;
});
