import { splitFileIntoChunks } from '@/util/file';
import { Interceptor } from './interceptor';

export class FileService extends Interceptor {
  public async uploadFile(file: File, onError: (error: any) => void): Promise<void> {
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
      onError(error);
    }
  }
}
