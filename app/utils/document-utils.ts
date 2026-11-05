/* eslint-disable @typescript-eslint/no-explicit-any */
export const DOCUMENT_CLASS_URI = 'http://xmlns.com/foaf/0.1/Document';

export function isCompliantObject(object: any): boolean {
  if (object.validCount !== object.totalCount) return false;
  if (object.sparqlValidationResults?.length) return false;
  return (object.properties ?? []).every(
    (property: any) =>
      property.valid !== false && !property.sparqlValidationResults?.length,
  );
}

export function hasCompliantDocument(collection: any): boolean {
  return (
    collection.classURI === DOCUMENT_CLASS_URI &&
    collection.objects.some(isCompliantObject)
  );
}
