'use client';

import FileUpload from '@/components/document/file-upload';
import { authenticate } from '../guards/auth.guard';

export default authenticate(function Home(): React.JSX.Element {
  return (
    <>
      <FileUpload />
    </>
  );
});
