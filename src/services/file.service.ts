import { splitFileIntoChunks } from '@/util/file';
import { Interceptor } from './interceptor.service';
import { FileChunk, File as FileModel } from '@/models/index';

export class FileService extends Interceptor {
  constructor(onError?: (error: any) => any) {
    super(onError ?? (() => null));
  }

  public async uploadFile(file: File): Promise<void> {
    const chunks = splitFileIntoChunks(file);
    let fileId: number | undefined;
    let order = 1;

    for await (const chunk of chunks) {
      const formData = new FormData();
      formData.append('chunk', chunk);

      const fileIdResponse = await this.interceptor<{ fileId: number }>({
        url: '/file/file_upload',
        method: 'POST',
        data: formData,
        params: {
          fileId,
          fileType: `.${file.name.split('.')[file.name.split('.').length - 1]}`,
          fileName: file.name,
        },
      });
      if (!fileIdResponse.data.fileId) return;

      fileId = fileIdResponse.data.fileId;
      order += 1;
    }
  }

  public async downloadFile(fileId: number, fileName: string): Promise<void> {
    const fileChunksResponse = await this.interceptor<FileChunk[]>({
      method: 'GET',
      url: '/file/get_file_chunks',
      params: { fileId },
    });
    if (!fileChunksResponse.data.length) return;

    const fileChunks = fileChunksResponse.data;
    let fileBuffer = [];

    for await (const fileChunk of fileChunks) {
      const chunk = await this.interceptor<ArrayBuffer>({
        method: 'GET',
        url: '/file/fetch_buffer',
        params: { fileChunkId: fileChunk.id },
        responseType: 'arraybuffer',
      });
      if (!chunk.data.byteLength) return;

      fileBuffer.push(new Uint8Array(chunk.data));
    }

    this.initiateDownload(fileBuffer, fileName);
  }

  public async fetchFiles(): Promise<FileModel[]> {
    const filesResponse = await this.interceptor<FileModel[]>({
      method: 'GET',
      url: '/file/get_files',
    });
    if (!filesResponse.data.length) return [];

    return filesResponse.data;
  }

  private initiateDownload(fileBuffer: Uint8Array[], fileName: string): void {
    const blob = new Blob(fileBuffer);

    // Create a download link and simulate download
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(link.href);
  }
}
