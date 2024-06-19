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
}

export default class SubjectProperty extends Component<ArgsInterface> {
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
  get displayIcon() {
    return this.isOpen ? 'nav-down' : 'nav-up';
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
