import { helper } from '@ember/component/helper';

export default helper(function joinWithDash([val1, val2]) {
  return `${val1}-${val2}`;
});
