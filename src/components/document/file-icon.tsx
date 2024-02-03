import React from 'react';
import {
  MdOutlineImage,
  MdMusicNote,
  MdVideocam,
  MdTextSnippet,
  MdFolderZip,
} from 'react-icons/md';
import { LuFileJson } from 'react-icons/lu';
import { BsFiletypeExe } from 'react-icons/bs';

const ICONS = {
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
};

export default function FileIcon(): React.JSX.Element {
  return <div></div>;
}
