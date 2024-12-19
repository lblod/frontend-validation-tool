import { helper } from '@ember/component/helper';

export default helper(function currentUrlHash([validationId]: [string]) {
  const hash = window.location.href.split('#')[1];

  if (!hash || !validationId) {
    return false;
  }

  const [, parentIdHash, childIdHash] = hash.split('-');
  const [parentId, childId] = validationId.toString().split('-');
  if (parentId && parentId.toString() !== parentIdHash) {
    return false;
  }

  if (childId) {
    return childId.toString() === childIdHash;
  }

  return true;
});
