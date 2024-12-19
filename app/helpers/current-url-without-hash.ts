import { helper } from '@ember/component/helper';

export default helper(function currentUrlWithoutHash() {
  return window.location.href.split('#')[0];
});
