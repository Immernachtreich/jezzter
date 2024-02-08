import { splitFileIntoChunks } from '@/util/file';
import { Interceptor } from '@/services/interceptor.service';
import { FileChunk, File as FileModel } from '@/models/index';
import { limitPromise } from '@/util/promise';

/**
 * File service for all file related API operations
 * @class
 * @extends Interceptor
 */
export class FileService extends Interceptor {
  /**
   * @constructor
   * @param {(error: any) => any} onError - The function to call when an error occurs
   */
  constructor(onError?: (error: any) => any) {
    super(onError ?? (() => null));
  }

  /**
   *  Function to break down a given file into chunks and upload it
   * @param {File} file - The file to be uploaded
   * @param {(progress: number) => void} reportProgress - The callback function to be called after each chunk upload
   * @returns {Promise<void>}
   */
  public async uploadFile(file: File, reportProgress: (progress: number) => void): Promise<void> {
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
      reportProgress(progressPrecent);

      order += 1;
    }
  }

  /**
   * Function to break a given file into chunks and upload it.
   * @param {number} fileId - The ID of the file
   * @param {string} fileName - The name of the file
   * @param {(progress: number) => string} onChunkDownload - The callback function to be called after every chunk download
   * @returns {Promise<void>}
   */
  public async downloadFile(
    fileId: number,
    fileName: string,
    onChunkDownload: (progress: number) => void
  ): Promise<void> {
    // Fetch all the individual chunk's metadata
    const fileChunksResponse = await this.interceptor<FileChunk[]>({
      method: 'GET',
      url: '/file/get_file_chunks',
      params: { fileId },
    });
    if (!fileChunksResponse.data.length) return;

    const fileChunks = fileChunksResponse.data;

    const chunkPromises = fileChunks.map((chunk, index) =>
      this.interceptor<ArrayBuffer>({
        method: 'GET',
        url: '/file/fetch_buffer',
        params: { fileChunkId: chunk.id },
        responseType: 'arraybuffer',
      }).then(response => {
        onChunkDownload(Math.round((index / fileChunks.length) * 100));

        return response.data;
      })
    );

    const chunks = await limitPromise<ArrayBuffer>(chunkPromises, 10);
    const fileBuffer = chunks.map(chunk => new Uint8Array(chunk));

    this.initiateDownload(fileBuffer, fileName);
  }

  /**
   * Function to fetch all files for a given user
   * @returns {Promise<FileModel[]>} - The fetched files
   */
  public async fetchFiles(): Promise<FileModel[]> {
    const filesResponse = await this.interceptor<FileModel[]>({
      method: 'GET',
      url: '/file/get_files',
    });

    return filesResponse.data.length ? filesResponse.data : [];
  }

  /**
   * Function to initiate download on the browser
   * @param {Uint8Array[]} fileBuffer - The file buffer
   * @param {string} fileName - The name of the file
   * @returns {void}
   */
  private initiateDownload(fileBuffer: Uint8Array[], fileName: string): void {
    // Convert file to a blob
    const blob = new Blob(fileBuffer);

    // Create a download link and simulate download
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(link.href);
  }
}
