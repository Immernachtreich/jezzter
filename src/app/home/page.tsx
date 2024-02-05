'use client';

import FileUpload from '@/components/document/file-upload';
import { authenticate } from '../guards/auth.guard';
import FileIcon from '@/components/document/file-icon';
import { FileService } from '@/services/file.service';
import { useSnackbar } from '@/context/snackbar-context';
import { useLayoutEffect, useState } from 'react';
import { File as FileModel } from '../../models/index';
import { NonAttribute } from '@sequelize/core';
import { Loader } from '@/components/feedback/loader';

export default authenticate(function Home(): React.JSX.Element {
  const { showSnackbar } = useSnackbar();
  const [files, setFiles] = useState<NonAttribute<FileModel[]>>([]);
  const [loading, showLoading] = useState<boolean>(false);
  const [services, setServices] = useState<{ [key: string]: any }>({});

  useLayoutEffect(() => {
    setServices({
      fileService: new FileService(error => {
        showLoading(false);
        showSnackbar(error.response.data.message);
      }),
    });

    fetchFiles();
  }, []);

  const uploadFile = async (fileToBeUploaded: File[]) => {
    if (!fileToBeUploaded.length) return showSnackbar('No files selected');

    showLoading(true);

    for await (const file of fileToBeUploaded) await services.fileService.uploadFile(file);

    fetchFiles();
  };

  const downloadFile = async (fileId: number, fileName: string) => {
    showLoading(true);

    await services.fileService.downloadFile(fileId, fileName);
    showLoading(false);
  };

  const fetchFiles = async (): Promise<void> => {
    showLoading(true);

    const fileService = new FileService((error: any) => {
      showLoading(false);
      showSnackbar(error.response.data.message);
    });

    const fetchedFiles = await fileService.fetchFiles();

    setFiles(fetchedFiles);
    showLoading(false);
  };

  return (
    <>
      <Loader showLoading={loading} />
      <FileUpload onUpload={uploadFile} />
      <section className="p-3">
        <h2 className="text-[20px] p-3">My Files:</h2>

        <div className="grid xl:grid-cols-6 lg:grid-cols-5 md:grid-cols-4 grid-cols-2 gap-6">
          {!!files.length &&
            files.map((file, index) => {
              return (
                <FileIcon
                  id={file.id}
                  name={file.name}
                  type={file.type}
                  key={index}
                  onDownload={downloadFile}
                />
              );
            })}
        </div>
      </section>
    </>
  );
});
