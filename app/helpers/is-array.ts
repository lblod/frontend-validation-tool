import { helper } from '@ember/component/helper';

export default helper(function isArray([value] /*, named*/) {
  return Array.isArray(value);
});
