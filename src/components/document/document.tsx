'use client';
import React, { useEffect } from 'react';

// const FILES = [
//   {
//     path: '/Downloads/games/image.png',
//     content: 'Some Buffer',
//     imageSize: 30000,
//   },
//   {
//     path: '/Downloads/form.pdf',
//     content: 'Some Buffer',
//     imageSize: 40000,
//   },
//   {
//     path: '/Hums/Folder_2/him.png',
//     content: 'Some Buffer',
//     imageSize: 5000,
//   },
// ];

// const groupedByFolder = {
//   Downloads: {
//     Game: {
//       'image.png': {
//         imageSize: 30000,
//         content: 'Some Buffer',
//       },
//     },
//     'form.pdf': {
//       imageSize: 40000,
//       content: 'Some Buffer',
//     },
//   },
//   Hums: {
//     Folder_2: {
//       'him.png': {
//         imageSize: 5000,
//         content: 'Some Buffer',
//       },
//     },
//   },
// };

// const groupedByFolder = {};
// FILES.forEach(file => {
//   const pathParts = file.path.split('/').filter(Boolean); // Filter out empty parts

//   let currentFolder: any = groupedByFolder;

//   // Iterate through each part of the path
//   pathParts.forEach((folder, index) => {
//     // Create a new folder if it doesn't exist
//     currentFolder[folder] = currentFolder[folder] || {};

//     // If it's the last part of the path, assign the file details
//     if (index === pathParts.length - 1) {
//       currentFolder[folder] = {
//         isFolder: false, // It's a file
//         imageSize: file.imageSize,
//         content: file.content,
//       };
//     } else {
//       // For intermediate parts of the path, mark them as folders
//       currentFolder[folder] = {
//         isFolder: true,
//         ...currentFolder[folder],
//       };
//     }

//     // Move to the next level in the nested structure
//     currentFolder = currentFolder[folder];
//   });
// });

// console.log(groupedByFolder);

export default function Document(): React.JSX.Element {
  useEffect(() => {}, []);

  return <div></div>;
}
