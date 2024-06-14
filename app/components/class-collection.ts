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

  publication: {
    maturity: string;
    classes: Object[]
  }
  
  // subject arguments
  collection: {
    classURI: string;
    className: string;
    count: number;
    objects: Object[];
  };
}

export default class SubjectProperty extends Component<ArgsInterface> {
  // AUAccordion settings
  get tooManyDocuments() {
    const { className, objects } = this.args.collection;
    return (className === "Document") && (objects.length > 1)
  }
}
