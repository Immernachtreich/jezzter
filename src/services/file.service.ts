import { splitFileIntoChunks } from '@/util/file';
import { Interceptor } from '@/services/interceptor.service';
import { FileChunk, File as FileModel } from '@/models/index';

export class FileService extends Interceptor {
  constructor(onError?: (error: any) => any) {
    super(onError ?? (() => null));
  }

  public async uploadFile(
    file: File,
    reportProgress: (progress: number, fileName: string) => void
  ): Promise<void> {
    const chunks = splitFileIntoChunks(file);

    const createdFileResponse = await this.interceptor<FileModel>({
      method: 'POST',
      url: '/file/create_file',
      data: {
        fileName: file.name,
        fileType: `.${file.name.split('.')[file.name.split('.').length - 1]}`,
      },
    });
    if (!createdFileResponse) return;

    let order = 1;

    for await (const chunk of chunks) {
      const formData = new FormData();
      formData.append('chunk', chunk);

      await this.interceptor({
        url: '/file/file_upload',
        method: 'POST',
        data: formData,
        params: { fileId: createdFileResponse.data.id, order },
      });

      const progressPrecent = (order / chunks.length) * 100;
      reportProgress(progressPrecent, file.name);

      order += 1;
    }
  }

  public async downloadFile(
    fileId: number,
    fileName: string,
    onChunkDownload: (progress: number) => void
  ): Promise<void> {
    const startTime = Date.now();

    const fileChunksResponse = await this.interceptor<FileChunk[]>({
      method: 'GET',
      url: '/file/get_file_chunks',
      params: { fileId },
    });
    if (!fileChunksResponse.data.length) return;

    const fileChunks = fileChunksResponse.data;

    const fileBuffer: Uint8Array[] = [];

    for await (const fileChunk of fileChunks) {
      const chunk = await this.interceptor<ArrayBuffer>({
        method: 'GET',
        url: '/file/fetch_buffer',
        params: { fileChunkId: fileChunk.id },
        responseType: 'arraybuffer',
      });

      fileBuffer.push(new Uint8Array(chunk.data));
    }

    console.log('time: ', Date.now() - startTime);

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
