import type {
  ApiSuccessResponse,
  Client,
} from "satisfactory-server-api-client";

/**
 * Generates a memoized function that will cache the result of the callback function.
 *
 * @param cb The callback function that will be memoized.
 * @param cacheDurationMs The duration in milliseconds that the data will be cached.
 * @returns A memoized function that will return the data from the callback function.
 */
export function memoFactory<TData>(
  cb: (client: Client) => Promise<ApiSuccessResponse<TData>>,
  cacheDurationMs: number = 1000
) {
  let refreshNow: number = Date.now();
  let cachedData: TData;
  let currentPromise: Promise<ApiSuccessResponse<TData>> | null = null;

  /**
   * Memoizes the result of the callback function.
   *
   * Will always return data, or result in a thrown error.
   *
   * @param client The client that will be passed forward to the callback.
   */
  return async function memo(client: Client): Promise<TData> {
    const now = Date.now();

    if (now < refreshNow) {
      return cachedData;
    }

    // If there is no current promise, then we own the promise and need to handle the error.
    const ownsPromise = !currentPromise;

    try {
      if (!currentPromise) {
        currentPromise = cb(client);
      }

      const { data } = await currentPromise;

      refreshNow = now + cacheDurationMs;
      cachedData = data;
      currentPromise = null;

      return data;
    } catch (error) {
      if (ownsPromise) {
        console.error(error);
        currentPromise = null;
      }
      throw error;
    }
  };
}
