importScripts('./index-service.js');

self.addEventListener('install', event => {
  // const request = indexedDB.open('files', 1);
  event.waitUntil(openDatabase());

  // request.onupgradeneeded = event => {
  //   /** @type {IDBDatabase} */
  //   const database = event.target.result;
  //   const chunkStore = database.createObjectStore('Chunks', { autoIncrement: true });

  //   console.log(chunkStore);
  // };

  // request.onsuccess = event => {};
});

function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('files', 1);

    request.onupgradeneeded = event => {
      const database = event.target.result;

      // Create an object store only if it doesn't exist
      if (!database.objectStoreNames.contains('Chunks')) {
        const chunkStore = database.createObjectStore('Chunks', { autoIncrement: true });
        console.log(chunkStore);
      }
    };

    request.onsuccess = event => {
      /** @type {IDBDatabase} */
      const database = event.target.result;

      const transaction = database.transaction('Chunks', 'readwrite');

      const chunksStore = transaction.objectStore('Chunks');

      const addChunkQuery = chunksStore.put({ hello: true });

      addChunkQuery.onsuccess = console.log;
      addChunkQuery.onerror = console.error;

      transaction.oncomplete = () => database.close();
      resolve();
    };

    request.onerror = event => {
      reject(new Error(`Error opening IndexedDB: ${event.target.error}`));
    };
  });
}
