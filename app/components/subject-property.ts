import { action } from '@ember/object';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import pretty from 'pretty';

interface ArgsInterface {
  // subject arguments
  property: {
    name: string;
    targetClass: string;
    description: string;
    path: string;
    value: string[] | object[];
    minCount?: number;
    maxCount?: number;
    actualCount: number;
    valid: boolean;
    maturityLevel: string;
    example?: string;
    encodedExample?: string;
    sparqlValidationResults?: ValidationResult[];
  };

  // entry arguments
  alertSkin?: string;
}

interface ValidatedProperty {
  actualCount: number;
  totalCount: number;
}

interface ValidationResult {
  resultSeverity?: string;
  focusNode?: string;
  resultPath?: string;
  value?: string;
  resultMessage: string;
}

export default class SubjectProperty extends Component<ArgsInterface> {
  get skin() {
    const { valid, actualCount, minCount } = this.args.property;
    if (actualCount === 0 && minCount === 0) return 'warning';
    if (valid == undefined) return 'default';
    if (this.isCorrect) return 'success';
    return valid ? 'whole' : 'error';
  }

  get classNames() {
    const { valid, actualCount, minCount } = this.args.property;
    if (actualCount === 0 && minCount === 0) return;
    if (valid == undefined) return;
    if (this.isCorrect) return;
    return valid && 'au-c-pill--whole';
  }

  get pillMessage() {
    const { valid, actualCount, minCount } = this.args.property;
    if (actualCount === 0 && minCount === 0) return 'Optioneel';
    if (valid == undefined) return 'Niet gevalideerd';
    if (this.isCorrect) return 'Correct';
    return valid ? 'Volledig' : 'Onvolledig';
  }

  get isCorrect() {
    const { value, minCount, maxCount } = this.args.property;
    if (value.length === 0) {
      return minCount === 0;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return value
      ? minCount === undefined && maxCount === undefined
        ? true
        : (value as ValidatedProperty[]).every(
            (v: ValidatedProperty) => v.totalCount === v.actualCount,
          )
      : true;
  }

  get displayURI() {
    return this.args.property.path || '';
  }

  get hasNoValues() {
    return this.args.property.value.length <= 0;
  }

  get countText() {
    const { actualCount, minCount, maxCount } = this.args.property;

    // Fallback to actual, min, and max counts
    const text = actualCount !== undefined ? `${actualCount}` : 'N/A';
    const minMaxText: string[] = [];

    if (minCount !== undefined) {
      minMaxText.push(`Min: ${minCount}`);
    }
    if (maxCount !== undefined) {
      minMaxText.push(`Max: ${maxCount}`);
    }

    return minMaxText.length > 0 ? `${text} (${minMaxText.join(', ')})` : text;
  }

  get encodedExample() {
    const ex = this.args.property.example;
    const example = ex || '';
    const prettyExample = pretty(example);
    return prettyExample;
  }

  get displayExample() {
    const encodedExample = this.encodedExample;
    return encodedExample;
  }

  @tracked showExample: boolean = false;

  @action
  toggleShowExample() {
    this.showExample = !this.showExample;
  }

  get displayExampleClass() {
    const ex = this.args.property.example;
    const example = ex || '';

    if (this.showExample && example.startsWith('<')) return '';
    else return 'au-u-hidden';
  }
  get displayExampleButtonClass() {
    const example = this.args.property.example;

    if (typeof example !== 'undefined' && example.startsWith('<')) return '';
    // else return 'au-u-hidden';
    else return '';
  }
}
