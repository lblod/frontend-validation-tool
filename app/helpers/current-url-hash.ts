import { helper } from '@ember/component/helper';

export default helper(function currentUrlHash([validationId]: [
  string,
  string,
]) {
  const hash = window.location.href.split('#')[1];
  if (hash && validationId) {
    const parts = hash.split('-');
    const id = validationId.toString().split('-')[0];
    if (parts[1] === id) {
      return true;
    }
  }
  return false;
});
