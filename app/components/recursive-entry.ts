import Component from '@glimmer/component';
import { service } from '@ember/service';

interface ArgsInterface {
  index: number;
  // subject arguments
  subject: {
    uri: string;
    class: string;
    className: string;
    usedShape?: string;
    shapeName?: string;
    totalCount: number;
    sparqlValidationResults?: ValidationResult[];
    properties: Array<object>;
    validCount?: number;
  };
}

interface ValidationResult {
  resultSeverity?: string;
  focusNode?: string;
  resultPath?: string;
  value?: string;
  resultMessage: string;
}

export default class RecursiveEntry extends Component<ArgsInterface> {
  @service document;

  get skin() {
    const { validCount, totalCount } = this.args.subject;
    return validCount !== undefined
      ? validCount! == totalCount!
        ? this.isCorrect
          ? 'success'
          : 'success'
        : 'error'
      : 'default';
  }

  get isPdf() {
    return this.args.subject.uri.endsWith('.pdf');
  }

  get classNames() {
    const { validCount, totalCount } = this.args.subject;
    return validCount === totalCount && 'au-c-pill--whole' && !this.isCorrect;
  }

  get pillMessage() {
    const { validCount, totalCount } = this.args.subject;
    return validCount !== undefined
      ? validCount! == totalCount!
        ? this.isCorrect
          ? 'Correct'
          : 'Volledig'
        : 'Onvolledig'
      : 'Niet gevalideerd';
  }

  get formattedName() {
    const { shapeName, className } = this.args.subject;
    return className || shapeName || name || 'Unvalidated subject';
  }

  get displayCounts() {
    const { validCount, totalCount } = this.args.subject;
    if (validCount !== undefined && totalCount !== undefined) {
      return `${validCount}/${totalCount}`;
    } else if (totalCount !== undefined) {
      return totalCount.toString();
    }
    return '';
  }

  get displayIndex() {
    // Don't show index with Bestuursorgaan, because multiple shapes lead to multiple occurences of the same instance
    if (
      this.args.subject.class ===
      'http://data.vlaanderen.be/ns/besluit#Bestuursorgaan'
    ) {
      return '';
    } else if (this.document.indexOfUri.has(this.args.subject.uri))
      return this.document.indexOfUri.get(this.args.subject.uri);
    else if (this.args.index === undefined) return '';
    return this.args.index + 1;
  }

  get isCorrect() {
    const { properties } = this.args.subject;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return properties ? properties.every((v: any) => v.valid === true) : true;
  }

  get displayURI() {
    return this.args.subject.uri || '';
  }

  get hasURL() {
    return !!this.args.subject.uri;
  }

  get countText() {
    const { validCount, totalCount } = this.args.subject;

    // When validCount and totalCount are both available
    if (validCount !== undefined && totalCount !== undefined) {
      return `${validCount}/${totalCount}`;
    }

    // When only totalCount is available
    if (totalCount !== undefined && validCount === undefined) {
      return totalCount;
    }

    return '';
  }
}
