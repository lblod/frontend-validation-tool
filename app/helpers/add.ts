import { helper } from '@ember/component/helper';

export default helper(function add([number, increment]) {
  return Number(number) + Number(increment);
});
