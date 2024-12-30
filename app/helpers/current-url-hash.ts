import { helper } from '@ember/component/helper';

export default helper(function currentUrlHash([validationId]: [string]) {
  const hash = window.location.href.split('#')[1];

  if (!hash || !validationId) {
    return false;
  }

  const hashParts = hash.replace('validationBlock-', '').split('-');
  const validationParts = validationId.toString().split('-');
  if (!hashParts.length || !validationParts.length) {
    return false;
  }

  for (let i = 0; i < validationParts.length; i++) {
    if (validationParts[i]?.toString() !== hashParts[i]?.toString()) {
      return false;
    }
  }

  return true;
});
