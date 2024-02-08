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
import { DeterministicLoader } from '@/components/feedback/deterministic-loader';

export default authenticate(function Home(): React.JSX.Element {
  const { showSnackbar } = useSnackbar();

  const [loading, showLoading] = useState<boolean>(false);
  const [deterministicLoading, setDeterministicLoading] = useState<{
    loading: boolean;
    primaryProgress: number;
    secondaryLoader?: boolean;
    secondaryProgress?: number;
    loadingText?: string;
  }>({
    loading: false,
    primaryProgress: 0,
  });
  const [files, setFiles] = useState<NonAttribute<FileModel[]>>([]);
  const [services, setServices] = useState<{ fileService?: FileService }>({});

  useLayoutEffect(() => {
    setServices({
      fileService: new FileService(error => {
        showLoading(false);
        setDeterministicLoading({
          loading: false,
          primaryProgress: 0,
          secondaryLoader: false,
        });
        showSnackbar(error.response.data.message);
      }),
    });
    fetchFiles();
  }, []);

  const uploadFile = async (filesToBeUploaded: File[]) => {
    if (!filesToBeUploaded.length) return showSnackbar('No files selected');

    let fileIndex = 0;
    for await (const file of filesToBeUploaded) {
      setDeterministicLoading({
        loading: true,
        primaryProgress: 0,
        loadingText: `Uploading ${file.name}... 0%`,
        secondaryLoader: true,
        secondaryProgress: (fileIndex / filesToBeUploaded.length) * 100,
      });

      await services.fileService!.uploadFile(file, progress => {
        setDeterministicLoading({
          loading: true,
          primaryProgress: progress,
          loadingText: `Uploading ${file.name}... ${progress}%`,
          secondaryLoader: true,
          secondaryProgress: (fileIndex / filesToBeUploaded.length) * 100,
        });
      });
    }

    setDeterministicLoading(dl => {
      dl.loading = false;
      return dl;
    });

    await fetchFiles();
  };

  const downloadFile = async (fileId: number, fileName: string) => {
    setDeterministicLoading({
      loading: true,
      loadingText: `Downloading ${fileName}... 0%`,
      primaryProgress: 0,
    });

    await services.fileService!.downloadFile(fileId, fileName, progress => {
      setDeterministicLoading({
        loading: true,
        primaryProgress: progress,
        loadingText: `Downloading ${fileName}... ${progress}%`,
      });
    });

    setDeterministicLoading({
      loading: false,
      primaryProgress: 0,
    });
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

  const deleteFile = async (fileId: number): Promise<void> => {
    showLoading(true);
    await services.fileService?.deleteFile(fileId);
    showLoading(false);

    fetchFiles();
  };

  return (
    <>
      <DeterministicLoader
        showLoading={deterministicLoading.loading}
        primaryProgress={deterministicLoading.primaryProgress}
        loadingText={deterministicLoading.loadingText}
        secondaryLoader={deterministicLoading.secondaryLoader}
        secondaryProgress={deterministicLoading.secondaryProgress}
      />
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
                  onDelete={deleteFile}
                />
              );
            })}
        </div>
      </section>
    </>
  );
});
