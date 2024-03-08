import type { Bindings } from '@comunica/types';

/* function to validate a publication
  param:
  - publication: object to be validated
  returns:
  - one of the following valuesL: [besluitenlijst, notulen, agenda]
*/
export async function determineDocumentType(
  bindings: Bindings[],
): Promise<string> {
  // Look for document type predicate if it is present
  for (const b of bindings) {
    if (
      b.get('p')!.value === 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type' &&
      b
        .get('o')!
        .value.includes(
          'https://data.vlaanderen.be/id/concept/BesluitDocumentType/',
        )
    ) {
      switch (b.get('o')!.value) {
        case 'https://data.vlaanderen.be/id/concept/BesluitDocumentType/8e791b27-7600-4577-b24e-c7c29e0eb773': {
          return 'Notulen';
        }
        case 'https://data.vlaanderen.be/id/concept/BesluitDocumentType/3fa67785-ffdc-4b30-8880-2b99d97b4dee': {
          return 'Besluitenlijst';
        }
        case 'https://data.vlaanderen.be/id/concept/BesluitDocumentType/13fefad6-a9d6-4025-83b5-e4cbee3a8965': {
          return 'Agenda';
        }
      }
    }
  }
  return 'unknown document type';
}

/* function to validate the properties of a subject
  param:
  - subject: object to be validated
  returns:
  - one of the following valuesL: [besluitenlijst, notulen, agenda]
*/
export function validateProperty(
  subject: Bindings[],
  propertyShape: Bindings[],
): any {
  const result: any = {};
  propertyShape.forEach((p) => {
    switch (p.get('p')!.value) {
      case 'http://www.w3.org/ns/shacl#name': {
        result.name = p.get('o')!.value;
        break;
      }
      case 'http://www.w3.org/ns/shacl#class': {
        result.targetClass = p.get('o')!.value;
        break;
      }
      case 'http://www.w3.org/ns/shacl#description': {
        result.description = p.get('o')!.value;
        break;
      }
      case 'http://www.w3.org/ns/shacl#path': {
        result.path = p.get('o')!.value;
        break;
      }
      case 'http://www.w3.org/ns/shacl#minCount': {
        result.minCount = p.get('o')!.value;
        break;
      }
      case 'http://www.w3.org/ns/shacl#maxCount': {
        result.maxCount = p.get('o')!.value;
        break;
      }
      default: {
        console.log(`default ${p.get('p')!.value}`);
      }
    }
  });
  result.actualValue = subject
    .filter((s) => s.get('p')!.value === result.path)
    .map((s) => s.get('o')!.value);
  result.actualCount = result.actualValue.length;
  result.valid =
    (result.minCount === undefined || result.actualCount >= result.minCount) &&
    (result.maxCount === undefined || result.actualCount <= result.maxCount);
  return result;
}

/* function to validate a publication
  param:
  - publication: object to be validated
  returns:
  - contains a report of all missing requirements for a publication
*/
export async function validatePublication(
  publication: Bindings[],
  blueprint: Bindings[],
) {
  // get the URI of all unique subjects and place them in an array
  const subjectKeys: string[] = [
    ...new Set(publication.map((p) => p.get('s')!.value)),
  ];

  const result: any[] = [];
  // we should save the counts of properties per subject
  subjectKeys.forEach((subjectKey) => {
    const subject: Bindings[] = publication.filter(
      (p) => p.get('s')!.value === subjectKey,
    );

    const subjectType: string | undefined = subject
      .find(
        (s) =>
          s.get('p')!.value ===
          'http://www.w3.org/1999/02/22-rdf-syntax-ns#type',
      )
      ?.get('o')!.value;
    const blueprintShapeKey: string | undefined = blueprint
      .find(
        (b) =>
          b.get('p')!.value === 'http://www.w3.org/ns/shacl#targetClass' &&
          b.get('o')!.value === subjectType,
      )
      ?.get('s')!.value;
    const blueprintShape: Bindings[] = blueprint.filter(
      (b) => b.get('s')!.value === blueprintShapeKey,
    );
    const propertyKeys: string[] = blueprintShape
      .filter(
        (b) => b.get('p')!.value === 'http://www.w3.org/ns/shacl#property',
      )
      .map((b) => b.get('o')!.value);

    const regex: RegExp = /[^#]+$/;
    if (subject.length > 0 && blueprintShape.length > 0) {
      const resultSubject: any = {
        url: subjectKey,
        type: subjectType,
        typeName: regex.exec(subjectType!)
          ? regex.exec(subjectType!)![0]
          : 'Unknown type',
        usedShape: blueprintShapeKey,
        name: regex.exec(blueprintShapeKey!)
          ? regex.exec(blueprintShapeKey!)![0]
          : 'Unknown shape',
        totalCount: propertyKeys.length,
        validCount: 0,
        validatedProperties: [],
      };
      propertyKeys.forEach((propertyKey) => {
        const propertyShape: Bindings[] = blueprint.filter(
          (b) => b.get('s')!.value === propertyKey,
        );
        const validatedProperty: any = validateProperty(subject, propertyShape);
        if (validatedProperty.valid) resultSubject.validCount++;
        resultSubject.validatedProperties.push(validatedProperty);
      });
      result.push(resultSubject);
    }
  });
  return result;
}


export function checkMaturity(result: any[], properties: void | Bindings[]) {
  let valid: boolean = true;
  (properties as Bindings[]).forEach((property) => {
    return result.forEach((subject) => {
      const found = subject.validatedProperties.find(
        (p) => p.path === property.get('path')!.value,
      );
      if (found && !found.valid) {
        valid = false;
      }
    });
  });
  return valid;
}
