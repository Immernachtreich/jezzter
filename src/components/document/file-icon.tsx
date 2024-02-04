import React from 'react';
import {
  MdOutlineImage,
  MdMusicNote,
  MdVideocam,
  MdTextSnippet,
  MdFolderZip,
  MdDownload,
} from 'react-icons/md';
import { LuFileJson } from 'react-icons/lu';
import { BsFiletypeExe } from 'react-icons/bs';
import WhiteButton from '../UI/button';
import { FileService } from '@/services/file.service';

type ICONSType = { [key: string]: React.ReactNode };

const ICONS: ICONSType = {
  '.jpeg': <MdOutlineImage />,
  '.png': <MdOutlineImage />,
  '.jpg': <MdOutlineImage />,
  '.mp3': <MdMusicNote />,
  '.wap': <MdMusicNote />,
  '.mp4': <MdVideocam />,
  '.txt': <MdTextSnippet />,
  '.json': <LuFileJson />,
  '.exe': <BsFiletypeExe />,
  '.zip': <MdFolderZip />,
  '.rar': <MdFolderZip />,
  '.7zip+': <MdFolderZip />,
  '.tar': <MdFolderZip />,
  '.gz': <MdFolderZip />,
};

interface FileIconProps {
  name: string;
  type: keyof ICONSType;
  id: number;
  [key: string]: any;
}

export default function FileIcon(props: FileIconProps): React.JSX.Element {
  const downloadFile = async () => {
    const fileService = new FileService(error => console.log(error));
    await fileService.downloadFile(props.id, props.name);
  };

  return (
    <div className="border-2 rounded-md md:min-w-[150px]">
      <div className="flex flex-col justify-center items-center">
        <p className="text-[70px]">{ICONS[props.type] ?? ICONS['.txt']}</p>
        <p className="text-wrap text-xs">{props.name}</p>
        <WhiteButton className="p-1" onClick={downloadFile}>
          <MdDownload />
        </WhiteButton>
      </div>
    </div>
  );
}
