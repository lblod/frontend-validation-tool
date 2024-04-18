import { action } from '@ember/object';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

interface ArgsInterface {
  // AUAccordion arguments
  loading: boolean;
  iconOpen: string;
  iconClosed: string;
  defaultOpen: boolean;
  reverse: boolean;

  // property arguments
  property: {
    valid?: boolean;
    validCount?: number;
    totalCount?: number;
    actualCount?: number;
    minCount?: number;
    maxCount?: number;
    name?: string;
    path?: string;
    typeName?: string;
    url?: string;
    description?: string;
  };

  // entry arguments
  firstLevel: boolean;
  alertSkin?: string;
}

export default class Accordion extends Component<ArgsInterface> {
  get skin() {
    const { valid, validCount, totalCount, actualCount } = this.args.property;
    const { firstLevel, alertSkin } = this.args;

    if (alertSkin) return alertSkin;
    if (valid) return 'success';
    if (!this.isValidCount) {
      return 'error';
    }
    if (firstLevel && validCount! < totalCount!) return 'error';
    if (!firstLevel && validCount !== undefined && totalCount !== undefined) {
      if (validCount === totalCount) return 'success';
      if (validCount !== totalCount) return 'warning';
    }
    if (!valid && !validCount && !totalCount && actualCount === 0)
      return 'info';
    return 'info';
  }
  get displayClass() {
    const { valid, validCount, totalCount } = this.args.property;
    const { firstLevel } = this.args;

    if (
      firstLevel &&
      (valid || typeof valid === 'undefined') &&
      !(validCount! < totalCount!)
    ) {
      return 'au-c-alert--neutral au-u-margin-bottom';
    }
    return 'au-u-margin-bottom';
  }

  get formattedName() {
    const { name, path, typeName } = this.args.property;
    return name || path || typeName || 'Unvalidated Property';
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

  get displayCounts() {
    const { actualCount, validCount, totalCount } = this.args.property;
    if (actualCount !== undefined) {
      return actualCount.toString();
    } else if (validCount !== undefined && totalCount !== undefined) {
      return `${validCount}/${totalCount}`;
    } else if (totalCount !== undefined) {
      return totalCount.toString();
    }
    return '';
  }

  get displayURL() {
    return this.args.property.url || '';
  }

  get hasURL() {
    return !!this.args.property.url;
  }

  get description() {
    return this.args.property.description || '';
  }

  get countText() {
    const { actualCount, minCount, maxCount, validCount, totalCount } =
      this.args.property;

    // When validCount and totalCount are both available
    if (
      validCount !== undefined &&
      totalCount !== undefined &&
      actualCount === undefined
    ) {
      return `${validCount}/${totalCount}`;
    }

    // When only totalCount is available
    if (
      totalCount !== undefined &&
      validCount === undefined &&
      actualCount === undefined
    ) {
      return totalCount;
    }

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

  // AUAccordion settings

  get reverse() {
    if (this.args.reverse) return 'au-c-accordion--reverse';
    return '';
  }

  @action
  toggleAccordion() {
    this.isOpen = !this.isOpen;
  }

  get defaultOpen() {
    return this.args.defaultOpen ?? false;
  }

  @tracked isOpen = this.defaultOpen;

  get loading() {
    if (this.args.loading) return 'is-loading';
    else return '';
  }

  get iconOpen() {
    if (this.args.iconOpen) {
      return this.args.iconOpen;
    } else {
      return 'nav-down';
    }
  }

  get iconClosed() {
    if (this.args.iconClosed) {
      return this.args.iconClosed;
    } else {
      return 'nav-right';
    }
  }
}
