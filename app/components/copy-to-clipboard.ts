import { action } from '@ember/object';
import { service } from '@ember/service';
import Component from '@glimmer/component';

interface ArgsInterface {
  value: string;
}

interface ToasterService {
  success(message: string, title: string, options?: ToastOptions): void;
}
interface ToastOptions {
  type?: 'info' | 'success' | 'warning' | 'error';
  icon?: string;
  timeOut?: number;
  closable?: boolean;
}

export default class CopyToClipboard extends Component<ArgsInterface> {
  @service declare toaster: ToasterService;

  @action
  async handleClick(e: Event) {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(this.args.value);
      console.log('Copied to clipboard');
      this.onSuccess();
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  }

  @action
  onSuccess() {
    this.toaster.success('Gekopieerd naar klembord', '', {
      timeOut: 2000,
    });
  }
}
