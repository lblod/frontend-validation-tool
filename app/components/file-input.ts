/* eslint-disable @typescript-eslint/no-explicit-any */
import { action } from '@ember/object';
import { guidFor } from '@ember/object/internals';
import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import type { File } from 'buffer';
import { task } from 'ember-concurrency';
import type { UploadFile } from 'ember-file-upload/upload-file';
import FileQueueService from '../../types/ember-file-upload/index';

interface Args {
  title?: string;
  helpTextDragDrop?: string;
  helpTextFileNotSupported?: string;
  maxFileSizeMB?: number;
  accept?: string;
  multiple?: boolean;
  onQueueUpdate?: (filesQueueInfo: any) => void;
  onFinishUpload?: (uploadedFile: any, filesQueueInfo: any) => void;
}

export default class FileUpload extends Component<Args> {
  @service declare fileQueue: FileQueueService;
  @tracked uploadErrorData: Array<{ fileName: string; errorMessage: string }> =
    [];
  @tracked uploadedFiles: Array<UploadFile> = [];

  get uploadingMsg() {
    return this.uploadedFiles
      ? this.hasErrors
        ? 'Error'
        : `${this.uploadedFiles.length} Bestand(en) toegevoegd`
      : `Bezig met het opladen van ${this.queue.files.length} bestand(en). (${this.queue.progress}%)`;
  }

  get title() {
    return this.args.title || 'Bestanden toevoegen';
  }

  get helpTextDragDrop() {
    return (
      this.args.helpTextDragDrop ||
      'Sleep de bestanden naar hier om toe te voegen'
    );
  }

  get helpTextFileNotSupported() {
    return (
      this.args.helpTextFileNotSupported ||
      'Dit bestandsformaat wordt niet ondersteund.'
    );
  }

  get queueName() {
    return `${guidFor(this)}-fileUploads`;
  }

  get queue() {
    return this.fileQueue.findOrCreate(this.queueName);
  }

  get maxFileSizeMB() {
    return this.args.maxFileSizeMB || 20;
  }

  get hasErrors() {
    return this.uploadErrorData.length > 0;
  }

  @task
  *upload(file: File): Generator<
    File,
    any,
    {
      progress: number;
      fileName: string;
    }
  > {
    this.resetErrors();
    const uploadedFile = yield (this.uploadFileTask as any).perform(file);

    this.notifyQueueUpdate();

    if (uploadedFile && this.args.onFinishUpload)
      this.args.onFinishUpload(uploadedFile, this.calculateQueueInfo());
    this.uploadedFiles = [uploadedFile as any, ...this.uploadedFiles];
  }
  @action
  filter(file: File, files: Array<File>, index: number) {
    const isFirstFile = index === 0;

    if (isFirstFile) {
      this.resetErrors();
    } else {
      if (!this.args.multiple) {
        // We only upload the first file if `@multiple` is not set to true. This matches the behavior of ember-file-upload v4.
        return false;
      }
    }

    if (!isValidFileSize(file.size, this.maxFileSizeMB)) {
      this.addError({
        fileName: file.name,
        errorMessage: `Bestand is te groot (max ${this.maxFileSizeMB} MB)`,
      });
      return false;
    }

    if (!isValidFileType(file, this.args.accept)) {
      this.addError({
        fileName: file.name,
        errorMessage: this.helpTextFileNotSupported,
      });
      return false;
    }

    return true;
  }

  notifyQueueUpdate() {
    if (this.args.onQueueUpdate) {
      this.args.onQueueUpdate(this.calculateQueueInfo());
    }
  }

  @task({ enqueue: true, maxConcurrency: 3 })
  *uploadFileTask(
    file: File,
  ): Generator<File, any, { progress: number; fileName: string }> {
    this.notifyQueueUpdate();
    try {
      return yield file;
    } catch (e) {
      this.addError({ fileName: file.name });
      this.removeFileFromQueue(file);
      return null;
    }
  }

  calculateQueueInfo() {
    const filesQueueInfo = {
      isQueueEmpty: (this.uploadFileTask as any).isIdle,
    };
    return filesQueueInfo;
  }

  addError({
    fileName,
    errorMessage = 'Er is een fout opgetreden',
  }: {
    fileName: string;
    errorMessage?: string;
  }) {
    this.uploadErrorData = [
      ...this.uploadErrorData,
      {
        fileName: fileName,
        errorMessage: errorMessage,
      },
    ];
  }

  resetErrors() {
    this.uploadErrorData = [];
  }

  removeFileFromQueue(file: File) {
    this.queue.remove(file);
  }
}

export function isValidFileType(file: any, accept: any) {
  if (!accept) {
    return true;
  }

  const tokens = accept.split(',').map(function (token: string) {
    return token.trim().toLowerCase();
  });

  const validMimeTypes: any = tokens.filter(function (token: string) {
    return !token.startsWith('.');
  });
  const type = file.type?.toLowerCase();

  const validExtensions = tokens.filter(function (token: string) {
    return token.startsWith('.');
  });

  let extension = null;
  if (file.name && /(\.[^.]+)$/.test(file.name)) {
    extension = file.name.toLowerCase().match(/(\.[^.]+)$/)![1];
  }

  return (
    isValidMimeType(type, validMimeTypes) ||
    isValidExtension(extension, validExtensions)
  );
}

function isValidMimeType(type: string, validMimeTypes = []) {
  return validMimeTypes.some((validType: any) => {
    if (['audio/*', 'video/*', 'image/*'].includes(validType)) {
      const genericType = validType.split('/')[0];

      return type.startsWith(genericType);
    } else {
      return type === validType;
    }
  });
}

function isValidExtension(extension: any, validExtensions: any = []) {
  return validExtensions.includes(extension);
}

function isValidFileSize(fileSize: number, maximumSize: number) {
  return fileSize < maximumSize * Math.pow(1024, 2);
}
