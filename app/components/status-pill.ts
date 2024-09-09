/* eslint-disable @typescript-eslint/no-explicit-any */
import Component from '@glimmer/component';
import {
  getSkin,
  isCorrectForProperty,
  isCorrectForSubject,
} from '../utils/pill-utils';
import { STATUS_PILL_TYPES } from 'frontend-validation-tool/constants/status-pills';

interface Args {
  subject?: {
    validCount?: number;
    valid?: boolean;
    totalCount?: number;
    properties?: any[];
    objects?: any[];
  };
  property?: {
    valid?: boolean;
    actualCount?: number;
    minCount?: number;
    maxCount?: number;
    value?: any[];
    totalCount?: number;
    validCount?: number;
  };
}

export default class StatusPill extends Component<Args> {
  get isCorrect() {
    const { properties, objects } = this.args.subject || {};
    const { value = [], minCount, maxCount } = this.args.property || {};

    if (properties || objects) {
      return isCorrectForSubject(properties, objects);
    } else {
      return isCorrectForProperty(value, minCount, maxCount);
    }
  }

  get skin() {
    const { valid, validCount, totalCount } =
      this.args.subject || this.args.property || {};
    const { actualCount, minCount } = this.args.property || {};
    return getSkin(
      valid,
      validCount,
      totalCount,
      actualCount,
      minCount,
      this.isCorrect,
    );
  }

  get classNames() {
    const pillMessage = this.pillMessage;
    if (pillMessage === 'Volledig') {
      return 'au-c-pill--whole';
    }
  }

  get pillMessage() {
    const { valid, validCount, totalCount } =
      this.args.subject || this.args.property || {};
    const { actualCount, minCount } = this.args.property || {};
    if (actualCount === 0 && minCount === 0) return 'Optioneel';
    if (validCount !== undefined && totalCount !== undefined) {
      return validCount === totalCount
        ? this.isCorrect
          ? STATUS_PILL_TYPES.correct.name
          : STATUS_PILL_TYPES.whole.name
        : STATUS_PILL_TYPES.invalid.name;
    }
    if (valid !== undefined) {
      return valid
        ? this.isCorrect
          ? STATUS_PILL_TYPES.correct.name
          : STATUS_PILL_TYPES.whole.name
        : STATUS_PILL_TYPES.invalid.name;
    }
    return 'Niet gevalideerd';
  }
}
