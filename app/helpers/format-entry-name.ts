import { helper } from '@ember/component/helper';

export default helper(function formatEntryName([str] /*, named*/) {
  if (typeof str !== 'string') {
    return str; // Return the input as-is if it's not a string.
  }

  // Split string at every uppercase letter, lowercase everything, and join with spaces remove the word "shape" from the string.
  const transformed = str
    .split(/(?=[A-Z])/)
    .filter((s) => s.toLowerCase() !== 'shape')
    .map((s) => s.toLowerCase())
    .join(' ');

  // Capitalize the first letter of the resulting string.
  const result = transformed.charAt(0).toUpperCase() + transformed.slice(1);

  return result;
});
