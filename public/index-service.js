const { resolve } = require('path');

const STORES = ['ChunksToBeUploaded', 'ChunksToBeDownloaded'];

const initDatabse = (event, resolve = null) => {
  /** @type {IDBDatabase} */
  const database = event.target.result;

  STORES.forEach(store => {
    if (database.objectStoreNames.contains(store)) return;

    database.createObjectStore(store, { autoIncrement: true });
  });

  return resolve ? resolve(database) : database;
};

/**
 * Function to connect to indexDB as well sync stores.
 * @param {IDBRequest} request
 * @returns {Promise<IDBDatabase>}
 */
const openDatabase = () => {
  new Promise((resolve, reject) => {
    const request = indexedDB.open('files', 1);

    request.onupgradeneeded = event => initDatabse(event, resolve);

    request.onerror = reject;
  });
};

const addChunksToUpload = chunks => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('files', 1);

    request.onupgradeneeded = event => initDatabse(event);

    request.onsuccess = () => {};
  });
};

exports = { openDatabase, addChunksToUpload };

// request.onsuccess = event => {
//   /** @type {IDBDatabase} */
//   const database = event.target.result;

//   const transaction = database.transaction('ChunksToBeUploaded', 'readwrite');
//   const uploadChunksStore = transaction.objectStore('ChunksToBeUploaded');

//   const addChunkQuery = uploadChunksStore.put({ hello: true });

//   addChunkQuery.onsuccess = console.log;
//   addChunkQuery.onerror = console.error;

//   transaction.oncomplete = () => database.close();
//   resolve();
// };
