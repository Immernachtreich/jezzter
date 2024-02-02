import { splitFileIntoChunks } from '@/util/file';
import { Interceptor } from './interceptor.service';
import { FileChunk } from '@/models/index';

export class FileService extends Interceptor {
  private onError: (error: any) => void;

  constructor(onError?: (error: any) => void) {
    super();
    this.onError = onError ?? (() => null);
  }

  public async uploadFile(file: File): Promise<void> {
    const chunks = splitFileIntoChunks(file);
    let fileId: number | undefined;
    let order = 1;

    try {
      for await (const chunk of chunks) {
        const formData = new FormData();
        formData.append('chunk', chunk);

        fileId = (
          await this.interceptor<{ fileId: number }>({
            url: '/file/file_upload',
            method: 'POST',
            data: formData,
            params: { fileId, order, fileType: file.type },
          })
        ).data.fileId;

        order += 1;
      }
    } catch (error: any) {
      console.error(error);
      this.onError(error);
    }
  }

  public async fetchFile(fileId: number): Promise<void> {
    const fileChunks = (
      await this.interceptor<FileChunk[]>({
        method: 'GET',
        url: '/file/get_file_chunks',
        params: { fileId },
      })
    ).data;

    let fileBuffer = [];

    for await (const fileChunk of fileChunks) {
      const chunk = await this.interceptor({
        method: 'GET',
        url: '/file/fetch_buffer',
        params: { fileChunkId: fileChunk.id },
        responseType: 'arraybuffer',
      });

      fileBuffer.push(new Uint8Array(chunk.data));
    }

    // Create a Blob from the Uint8Array buffer
    const blob = new Blob(fileBuffer);

    // Create a download link
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'data.csv';

    // Simulate a click to trigger the download
    link.click();

    // Clean up resources
    URL.revokeObjectURL(link.href);
  }
}
