import { splitFileIntoChunks } from '@/util/file';
import { Interceptor } from './interceptor';

export class FileService extends Interceptor {
  public async uploadFile(file: File, onError: (error: any) => void): Promise<void> {
    const chunks = splitFileIntoChunks(file);

    try {
      const fileUploadPromises = chunks.map(chunk => {
        const formData = new FormData();
        formData.append('chunk', chunk);

        return this.interceptor({
          url: '/file/file_upload',
          method: 'POST',
          data: formData,
        });
      });

      await Promise.all(fileUploadPromises);
    } catch (error: any) {
      console.error(error);
      onError(error);
    }
  }
}
