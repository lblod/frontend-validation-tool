import { helper } from '@ember/component/helper';

export default helper(function isUri([str] /*, named*/) {
  if (typeof str !== 'string') {
    return false; // Return false if the input is not a string.
  }
  const urlPattern = /^(http:\/\/|https:\/\/).*/i;
  return urlPattern.test(str);
});
