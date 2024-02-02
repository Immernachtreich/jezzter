import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FileService } from '@/services/file.service';
import { useSnackbar } from '@/context/snackbar-context';

export default function FileUpload() {
  const { showSnackbar } = useSnackbar();
  const [files, setFiles] = useState<File[]>([]);

  async function uploadFile() {
    if (!files.length) return showSnackbar('No files selected');

    const fileService = new FileService(error => showSnackbar(error.message));

    for await (const file of files) await fileService.uploadFile(file);
  }

  const { getRootProps, getInputProps } = useDropzone({ multiple: true, onDrop: setFiles });

  return (
    <section className="h-[200px] flex flex-col items-center p-4">
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
