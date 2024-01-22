'use client';
import axios from 'axios';
import React, { useState } from 'react';

export default function Home() {
  const [file, setFile] = useState<File>();

  async function uploadFile() {
    try {
      const formData = new FormData();
      formData.append('file', file as Blob);

      const res = await fetch('/api/cloud/file-upload', {
        method: 'POST',
        body: formData,
      });

      console.log(res);
    } catch (error: any) {
      console.error(error);
    }
  }

  return (
    <section>
      <input type="file" onChange={e => setFile(e.target.files?.[0])} />
      <button onClick={uploadFile}>Submit</button>
    </section>
  );
}
