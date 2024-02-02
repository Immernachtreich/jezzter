const ONE_AND_A_HALF_GB = 1610612736;
const HUNDRED_KB = 100 * 1024;
const TWENTY_MEGABYTES = 1024 * 1024 * 20;

/**
 * Function to split a Buffer into multiple chunks of specified or less size.
 * @param {Buffer} buffer - Buffer to be split into multiple parts
 * @param {number} chunkSize - The size of the chunk to be split into (Default: is 1.5 GB)
 * @param {number} offset - The offset from which the chunk should be broken to
 * @param {Buffer[]} chunks - List of broken chunks
 * @returns {Buffer[]} - Returns once the chunk has been split into the specified chunk size
 */
export function splitBufferIntoChunks(
  buffer: Buffer,
  chunkSize: number = ONE_AND_A_HALF_GB,
  offset: number = 0,
  chunks: Buffer[] = []
): Buffer[] {
  if (offset >= buffer.length) return chunks;

  const limit = offset + chunkSize;
  const chunk = Buffer.from(buffer.subarray(offset, limit));
  chunks.push(chunk);

  return splitBufferIntoChunks(buffer, chunkSize, limit, chunks);
}

/**
 * Function to split a file into a defined sized chunks.
 * @param {File} file - The file to be split into chunks
 * @param {number} chunkSize - The size of the chunk to be split into
 * @param {number} offset - The offset from which to slice
 * @param {Blob[]} chunks - The split chunks list
 * @returns {Blob[]} - Returns once the chunks have all been split
 */
export function splitFileIntoChunks(
  file: File,
  chunkSize: number = TWENTY_MEGABYTES,
  offset: number = 0,
  chunks: Blob[] = []
): Blob[] {
  if (offset >= file.size) return chunks;

  const limit = offset + chunkSize;
  const chunk = file.slice(offset, limit);
  chunks.push(chunk);

  return splitFileIntoChunks(file, chunkSize, limit, chunks);
}
