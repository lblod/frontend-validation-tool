import { helper } from '@ember/component/helper';

export default helper(function currentUrlWithoutHash(positional /*, named*/) {
  return window.location.href.split('#')[0];
});
