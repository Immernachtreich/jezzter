'use client';

import FileUpload from '@/components/document/file-upload';
import { authenticate } from '../guards/auth.guard';
import FileIcon from '@/components/document/file-icon';
import { FileService } from '@/services/file.service';
import { useSnackbar } from '@/context/snackbar-context';
import { useEffect, useLayoutEffect, useState } from 'react';
import { File as FileModel } from '../../models/index';
import { NonAttribute } from '@sequelize/core';

export default authenticate(function Home(): React.JSX.Element {
  const { showSnackbar } = useSnackbar();
  const [files, setFiles] = useState<NonAttribute<FileModel[]>>([]);

  useEffect(() => {
    fetchFiles();
  }, []);

  const uploadFile = async (fileToBeUploaded: File[]) => {
    if (!fileToBeUploaded.length) return showSnackbar('No files selected');

    const fileService = new FileService(error => showSnackbar(error.response.data.message));

    for await (const file of fileToBeUploaded) await fileService.uploadFile(file);

    fetchFiles();
  };

  const fetchFiles = async (): Promise<void> => {
    const fileService = new FileService((error: any) => showSnackbar(error.response.data.message));
    const fetchedFiles = await fileService.fetchFiles();
    setFiles(fetchedFiles);
  };

  return (
    <>
      <FileUpload onUpload={uploadFile} />
      <section className="p-3">
        <h3 className="p-2">My Files:</h3>

        <div className="grid xl:grid-cols-8 lg:grid-cols-6 md:grid-cols-5 grid-cols-2 gap-2">
          {!!files.length &&
            files.map((file, index) => {
              return <FileIcon id={file.id} name={file.name} type={file.type} key={index} />;
            })}
        </div>
      </section>
    </>
  );
});
