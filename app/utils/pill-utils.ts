import { STATUS_PILL_TYPES } from 'frontend-validation-tool/constants/status-pills';

// pill-utils.ts
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
  if (isCorrect) return STATUS_PILL_TYPES.whole.skin;
  return validCount !== undefined && validCount === totalCount
    ? STATUS_PILL_TYPES.correct.skin
    : STATUS_PILL_TYPES.invalid.skin;
}

export function getClassNames(
  valid: boolean | undefined,
  validCount: number | undefined,
  totalCount: number | undefined,
  actualCount: number | undefined,
  minCount: number | undefined,
  isCorrect: boolean,
): string | undefined {
  if (actualCount === 0 && minCount === 0) return undefined;
  if (validCount === undefined && valid === undefined) return undefined;
  if (isCorrect) return undefined;
  return validCount !== undefined && validCount === totalCount
    ? 'au-c-pill--whole'
    : undefined;
}

export function getPillMessage(
  valid: boolean | undefined,
  validCount: number | undefined,
  totalCount: number | undefined,
  actualCount: number | undefined,
  minCount: number | undefined,
  isCorrect: boolean,
): string {
  if (actualCount === 0 && minCount === 0) return 'Optioneel';
  if (validCount !== undefined && totalCount !== undefined) {
    return validCount === totalCount
      ? isCorrect
        ? 'Correct'
        : 'Volledig'
      : 'Onvolledig';
  }
  if (valid !== undefined) {
    return valid ? (isCorrect ? 'Correct' : 'Volledig') : 'Onvolledig';
  }
  return 'Niet gevalideerd';
}

export function isCorrectForProperty(
  value: any[],
  minCount: number | undefined,
  maxCount: number | undefined,
): boolean {
  if (value.length === 0) {
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

export function hasValid(object: any): boolean {
  if (object.valid !== undefined) return true;
  if (object.validCount !== undefined && object.totalCount !== undefined)
    return true;
  if (Array.isArray(object.properties) && object.properties.length > 0) {
    return object.properties.every(hasValid);
  }
  if (Array.isArray(object.objects) && object.objects.length > 0) {
    return object.objects.every(hasValid);
  }
  return false;
}
