import { helper } from '@ember/component/helper';

export default helper(function isSingleStringInArray([variable] /*, named*/) {
  if (
    (Array.isArray(variable) &&
      variable.length === 1 &&
      typeof variable[0] === 'string') ||
    typeof variable === 'string'
  ) {
    return true;
  } else {
    return false;
  }
});
