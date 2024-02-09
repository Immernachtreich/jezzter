/**
 * Function to connect to indexedDB
 * @param {IDBOpenDBRequest} request
 * @returns {Promise<IDBDatabase>}
 */
const connectToDb = request =>
  new Promise((resolve, reject) => {
    request.onsuccess = event => resolve(event.target.result);
    request.onerror = () => reject();
  });

/**
 * Function to create databases
 * @param {IDBOpenDBRequest} request
 * @returns {Promise<IDBVersionChangeEvent}
 */
const createStores = request =>
  new Promise(resolve => (request.onupgradeneeded = event => resolve(event.target.result)));

exports = { connectToDb, createStores };
