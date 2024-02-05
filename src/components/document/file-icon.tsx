import React from 'react';
import {
  MdOutlineImage,
  MdMusicNote,
  MdVideocam,
  MdOutlineTextSnippet,
  MdFolderZip,
  MdDownload,
  MdDelete,
} from 'react-icons/md';
import { LuFileJson } from 'react-icons/lu';
import { BsFiletypeExe } from 'react-icons/bs';
import { IoDocumentOutline } from 'react-icons/io5';
import WhiteButton from '../UI/button';

type ICONSType = { [key: string]: React.ReactNode };

const ICONS: ICONSType = {
  '.jpeg': <MdOutlineImage />,
  '.png': <MdOutlineImage />,
  '.jpg': <MdOutlineImage />,
  '.mp3': <MdMusicNote />,
  '.wap': <MdMusicNote />,
  '.mp4': <MdVideocam />,
  '.txt': <MdOutlineTextSnippet />,
  '.json': <LuFileJson />,
  '.exe': <BsFiletypeExe />,
  '.zip': <MdFolderZip />,
  '.rar': <MdFolderZip />,
  '.7zip+': <MdFolderZip />,
  '.tar': <MdFolderZip />,
  '.gz': <MdFolderZip />,
  default: <IoDocumentOutline />,
};

interface FileIconProps {
  name: string;
  type: keyof ICONSType;
  id: number;
  [key: string]: any;
  onDownload: (fileId: number, fileName: string) => void;
}

export default function FileIcon(props: FileIconProps): React.JSX.Element {
  return (
    <div className="border-b rounded-md md:min-w-[150px] p-4">
      <div className="flex flex-col justify-between items-start">
        <div className="flex justify-start items-end w-full">
          <p className="text-[40px] h-fit">{ICONS[props.type] ?? ICONS['default']}</p>
          <WhiteButton
            className="mx-1 my-0 text-center border-none"
            onClick={() => props.onDownload(props.id, props.name)}
          >
            <MdDownload />
          </WhiteButton>
          <WhiteButton
            className="text-red-400 my-0 border-none hover:text-[var(--foreground)] hover:bg-red-400 mx-1"
            // onClick={() => props.onDownload(props.id, props.name)}
          >
            <MdDelete />
          </WhiteButton>
        </div>
        <p className="truncate text-xs p-2 text-start w-[150px] ">{props.name}</p>
      </div>
    </div>
  );
}
