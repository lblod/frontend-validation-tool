/* eslint-disable @typescript-eslint/no-explicit-any */
import { STATUS_PILL_TYPES } from 'frontend-validation-tool/constants/status-pills';

export function getSkin(
  valid: boolean | undefined,
  validCount: number | undefined,
  totalCount: number | undefined,
  actualCount: number | undefined,
  minCount: number | undefined,
  isCorrect: boolean,
): string {
  if (actualCount === 0 && minCount === 0)
    return STATUS_PILL_TYPES.optional.skin;
  if (validCount === undefined && valid === undefined)
    return STATUS_PILL_TYPES.unvalidated.skin;
  if (valid !== undefined && !valid) return STATUS_PILL_TYPES.invalid.skin;
  if (isCorrect) return STATUS_PILL_TYPES.whole.skin;
  return validCount !== undefined && validCount === totalCount
    ? STATUS_PILL_TYPES.correct.skin
    : STATUS_PILL_TYPES.invalid.skin;
}

export function isCorrectForProperty(
  value: any[],
  minCount: number | undefined,
  maxCount: number | undefined,
): boolean {
  if (
    value.length === 0 ||
    value[0] === 'Waarde niet gevonden' ||
    value[0] === ''
  ) {
    return minCount === 0;
  }
  return value
    ? minCount === undefined && maxCount === undefined
      ? true
      : value.every((v: any) => v.totalCount === v.actualCount)
    : true;
}

export function isCorrectForSubject(
  properties: any[],
  objects: any[],
): boolean {
  if (properties) {
    return properties.every((v: any) => v.valid === true);
  }
  if (objects) {
    return objects.every((v: any) => v.validCount === v.totalCount);
  }
  return true;
}
