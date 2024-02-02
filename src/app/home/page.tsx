'use client';

import FileUpload from '@/components/document/file-upload';
import { authenticate } from '../guards/auth.guard';
import { FileService } from '@/services/file.service';

export default authenticate(function Home(): React.JSX.Element {
  function sendRequest() {
    console.log('Send request');
    const fileService = new FileService(console.log);
    fileService.fetchFile(4);
  }

  return (
    <>
      <FileUpload />
      <button onClick={sendRequest}> Click </button>
    </>
  );
});
