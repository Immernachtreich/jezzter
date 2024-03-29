import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { IoMdCloudUpload } from 'react-icons/io';
import { MdUpload, MdViewAgenda } from 'react-icons/md';
import { DataGrid } from '@mui/x-data-grid';
import { Modal } from '@mui/material';
import WhiteButton from '../UI/button';

interface FileUploadProps {
  onUpload: (filesToBeUploaded: File[]) => void;
}
``;
export default function FileUpload(props: FileUploadProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [modal, setModal] = useState<boolean>(false);

  const convertFileSize = (size: number): string => {
    const GB = Math.round(size / (1024 * 1024 * 1024));
    const MB = Math.round(size / (1024 * 1024));
    const KB = Math.round(size / 1024);

    if (GB > 1) return `${GB} GB`;
    if (MB > 1) return `${MB} MB`;
    if (KB > 1) return `${KB} KB`;
    return `${size} B`;
  };

  // For Dropzone
  const { getRootProps, getInputProps } = useDropzone({ multiple: true, onDrop: setFiles });

  return (
    <section className="h-auto flex flex-col items-center p-4">
      <div
        {...getRootProps()}
        // @ts-ignore: Ignore TypeScript checking for webkitdirectory attribute
        webkitdirectory="true"
        directory=""
        className="border-[1px] w-full py-[100px] border-dashed flex flex-1 justify-center items-center cursor-pointer"
      >
        <input {...getInputProps()} />
        <div className="flex items-center justify-center">
          <IoMdCloudUpload className="text-[80px] md:text-[40px] mx-2" />
          <span className="text-[20px] inline-block align-baseline p-2">
            Drag 'n' drop some files here, or click to select files or a folder
          </span>
        </div>
      </div>

      <div className="grid-cols-2">
        <WhiteButton onClick={() => props.onUpload(files)} className="mx-2">
          <span className="inline-block align-middle text-xl mr-2">
            <MdUpload />
          </span>
          <span className="inline-block align-middle">Upload</span>
        </WhiteButton>
        {!!files.length && (
          <WhiteButton onClick={() => setModal(true)} className="mx-2">
            <span className="inline-block align-middle text-xl mr-2">
              <MdViewAgenda />
            </span>
            <span className="inline-block align-middle">View Selected Files</span>
          </WhiteButton>
        )}
      </div>

      <Modal
        open={modal}
        onClose={() => setModal(false)}
        className="flex justify-center items-center border-0"
      >
        <div className="justify-center items-center border-0 flex flex-col w-full lg:w-1/2">
          <DataGrid
            sx={{
              color: 'white',
              '[class^="Mui"]': { color: 'var(--foreground)' },
              backgroundColor: 'var(--background-start)',
              width: '100%',
            }}
            rows={files.map((file, index) => ({
              name: file.name as string,
              size: convertFileSize(file.size),
              type: file.type.split('/')[1] ? file.type.split('/')[1].toUpperCase() : '-',
              id: index + 1,
            }))}
            columns={[
              { field: 'id', headerName: 'Sr. No', flex: 1 },
              { field: 'name', headerName: 'Name', flex: 1 },
              { field: 'size', headerName: 'Size', flex: 1 },
              { field: 'type', headerName: 'Type', flex: 1 },
            ]}
            initialState={{ pagination: { paginationModel: { page: 0, pageSize: 5 } } }}
            autoHeight
            autoPageSize
          />
          <WhiteButton onClick={() => setModal(false)}>Close</WhiteButton>
        </div>
      </Modal>
    </section>
  );
}
