/* eslint-disable @typescript-eslint/no-explicit-any */
import 'ember-file-upload';

// Cannot use namespace 'FileQueueService' as a type.ts(2709)
// Public property 'fileQueue' of exported class has or is using private name 'FileQueueService'.ts(4031)}

declare module 'ember-file-upload' {
  export default class FileQueueService {
    public findOrCreate(queueName: string): any;
    public uploadFileTask: any;
  }

  // get the helper fileQueue to work located in "ember-file-upload/helpers/file-queue"
  export function fileQueue(): any;
}
