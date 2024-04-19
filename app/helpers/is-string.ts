import { helper } from '@ember/component/helper';

export default helper(function isString([value] /*, named*/) {
  return typeof value === 'string';
});
