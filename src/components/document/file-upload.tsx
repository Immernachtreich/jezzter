import axios from 'axios';
import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';

export default function FileUpload() {
  const [files, setFiles] = useState<File[]>([]);

  async function uploadFile(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    try {
      if (!files.length) {
        // TODO: Add error snackbar
        return;
      }

      console.log(files);

      const formData = new FormData();
      for (const file of files!) {
        formData.append('files', file);
      }

      const fileDetails = (
        await axios({
          url: '/api/cloud/file-upload',
          method: 'POST',
          data: formData,
        })
      ).data;

      console.log(fileDetails);
    } catch (error: any) {
      console.error(error);
    }
  }

  const { getRootProps, getInputProps } = useDropzone({
    multiple: true,
    onDrop: (acceptedFiles: File[]) => setFiles(acceptedFiles),
  });

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
