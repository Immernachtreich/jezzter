/**
 * Function to limit the number of promises to be resolved at once.
 * @param {Promise<T>[]} promises - The promises to be resolved
 * @param {number} concurrency - The number of promises to be resolved at once
 * @param {number} index - The current index of the promises
 * @param {T[]} resolvedPromises - The current resolved promises
 * @returns {T[]} - The resolved promises
 */
export async function limitPromise<T>(
  promises: Promise<T>[],
  concurrency: number = 10,
  index: number = 0,
  resolvedPromises: T[] = []
): Promise<T[]> {
  if (index >= promises.length) return resolvedPromises;

  const upperLimit = index + concurrency >= promises.length ? promises.length : index + concurrency;
  const concurrentPromises = promises.slice(index, upperLimit);
  const resolvedConcurrentPromises = await Promise.all(concurrentPromises);

  resolvedPromises.push(...resolvedConcurrentPromises);

  return limitPromise<T>(promises, concurrency, upperLimit, resolvedPromises);
}
