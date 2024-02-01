import axios from 'axios';
import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { MessageSnackbar, MessageSnackbarProps } from '../feedback/snackbar';
import { splitFileIntoChunks } from '@/util/file';
import { FileService } from '@/services/file';

export default function FileUpload() {
  const [files, setFiles] = useState<File[]>([]);
  const [snackbar, setSnackbar] = useState<MessageSnackbarProps>({
    message: '',
    open: false,
    onClose: () => {
      setSnackbar({ ...snackbar, open: false });
    },
  });

  async function uploadFile() {
    if (!files.length) {
      return setSnackbar({ ...snackbar, open: true, message: 'No files selected' });
    }

    const fileService = new FileService();
    for await (const file of files) {
      const startTime = Date.now();

      await fileService.uploadFile(file, (error: any) =>
        setSnackbar({ ...snackbar, message: error.message, open: true })
      );

      console.log('Total time: ', Date.now() - startTime);
    }
  }

  const { getRootProps, getInputProps } = useDropzone({
    multiple: true,
    onDrop: (acceptedFiles: File[]) => setFiles(acceptedFiles),
  });

  return (
    <section className="h-[200px] flex flex-col items-center p-4">
      <MessageSnackbar
        message={snackbar.message}
        timeout={2000}
        open={snackbar.open}
        onClose={snackbar.onClose}
      />
      <div
        {...getRootProps()}
        // @ts-ignore: Ignore TypeScript checking for webkitdirectory attribute
        webkitdirectory="true"
        directory=""
        className="border-[1px] w-full border-dashed flex flex-1 justify-center items-center cursor-pointer my-2"
      >
        <input {...getInputProps()} />
        <p>Drag 'n' drop some files here, or click to select files or a folder</p>
      </div>
      <button
        className="p-3 border-2 rounded-md hover:bg-white hover:text-black"
        onClick={uploadFile}
      >
        Upload
      </button>
    </section>
  );
}
