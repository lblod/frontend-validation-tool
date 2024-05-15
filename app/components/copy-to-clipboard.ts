import { action } from '@ember/object';
import { service } from '@ember/service';
import Component from '@glimmer/component';

interface ArgsInterface {
  value: string;
}

export default class CopyToClipboard extends Component<ArgsInterface> {
  @service toaster: any;
  @action async handleClick(e: Event) {
    e.stopPropagation();
    try {
      await navigator.clipboard
        .writeText(this.args.value)
        .then(() => {
          console.log('copied to clipboard');
          this.onSuccess();
        })
        .catch((err) => {
          console.error('Failed to copy: ', err);
        });
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  }

  @action onSuccess() {
    this.toaster.success('Gecopieerd naar klembord');
  }
}
