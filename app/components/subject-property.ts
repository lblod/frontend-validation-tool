import { action } from '@ember/object';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';


interface ArgsInterface {
  // subject arguments
  property: {
    name: string;
    targetClass: string;
    description: string;
    path: string;
    value: string[] | Object[];
    minCount?: number;
    maxCount?: number;
    actualCount: number;
    valid: boolean;
  };

  // entry arguments
  alertSkin?: string;
}

export default class SubjectProperty extends Component<ArgsInterface> {
  get skin() {
    const { valid } = this.args.property;
    const { alertSkin } = this.args;

    if (alertSkin) return alertSkin;
    if (valid) return 'success';


    return 'error';
  }

  get isValidCount() {
    const { actualCount, minCount, maxCount } = this.args.property;
    if (minCount === undefined && maxCount === undefined) {
      return true;
    }
    return (
      actualCount !== undefined &&
      (minCount === undefined || actualCount >= minCount) &&
      (maxCount === undefined || actualCount <= maxCount)
    );
  }

  get displayURI() {
    return this.args.property.path || '';
  }

  get hasNoValues(){
    return this.args.property.value.length <= 0
  }

  get countText() {
    const { actualCount, minCount, maxCount } =
      this.args.property;

    // Fallback to actual, min, and max counts
    const text = actualCount !== undefined ? `${actualCount}` : 'N/A';
    const minMaxText = [];

    if (minCount !== undefined) {
      minMaxText.push(`Min: ${minCount}`);
    }
    if (maxCount !== undefined) {
      minMaxText.push(`Max: ${maxCount}`);
    }

    return minMaxText.length > 0 ? `${text} (${minMaxText.join(', ')})` : text;
  }
}