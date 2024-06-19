import Component from '@glimmer/component';

interface ArgsInterface {
  // AUAccordion arguments
  loading: boolean;
  iconOpen: string;
  iconClosed: string;
  defaultOpen: boolean;
  reverse: boolean;

  publication: {
    maturity: string;
    classes: object[];
  };

  // subject arguments
  collection: {
    classURI: string;
    className: string;
    count: number;
    objects: object[];
  };
}

export default class SubjectProperty extends Component<ArgsInterface> {
  // AUAccordion settings
  get tooManyDocuments() {
    const { className, objects } = this.args.collection;
    return className === 'Document' && objects.length > 1;
  }
}
