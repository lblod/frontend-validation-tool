import Helper from '@ember/component/helper';
import { registerDestructor } from '@ember/destroyable';
import { inject as service } from '@ember/service';
import type {
  FileQueueSignature,
  QueueListener,
} from 'ember-file-upload/interfaces';
import FileQueueService, {
  DEFAULT_QUEUE,
} from 'ember-file-upload/services/file-queue';
import type { UploadFile } from 'ember-file-upload/upload-file';

/**
 * `file-queue` helper is one of the core primitives of ember-file-upload.
 *
 * @example
 *
 * using the default queue (no `name` property)
 *
 * ```hbs
 * {{#let (file-queue) as |queue|}}
 *   {{queue.progress}}%
 * {{/let}}
 * ```
 *
 * @example
 *
 * named queue:
 *
 * ```hbs
 * {{#let (file-queue name="photos") as |queue|}}
 *   {{queue.progress}}%
 * {{/let}}
 * ```
 */
export default class FileQueueHelper
  extends Helper<FileQueueSignature>
  implements QueueListener
{
  @service declare fileQueue: FileQueueService;

  declare named: FileQueueSignature['Args']['Named'];

  compute(
    _positional: FileQueueSignature['Args']['Positional'],
    named: FileQueueSignature['Args']['Named'],
  ) {
    this.named = named;
    const queue = this.fileQueue.findOrCreate(named.name ?? DEFAULT_QUEUE);

    queue.addListener(this);

    registerDestructor(this, () => {
      queue.removeListener(this);
    });

    return queue;
  }

  onFileAdded(file: UploadFile) {
    this.named.onFileAdded?.(file);
  }

  onFileRemoved(file: UploadFile) {
    this.named.onFileRemoved?.(file);
  }

  onUploadStarted(file: UploadFile) {
    this.named.onUploadStarted?.(file);
  }

  onUploadSucceeded(file: UploadFile, response: Response) {
    this.named.onUploadSucceeded?.(file, response);
  }

  onUploadFailed(file: UploadFile, response: Response) {
    this.named.onUploadFailed?.(file, response);
  }
}
