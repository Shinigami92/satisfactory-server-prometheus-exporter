import type {
  ApiSuccessResponse,
  Client,
} from "satisfactory-server-api-client";

export function memoFactory<TData>(
  cb: (client: Client) => Promise<ApiSuccessResponse<TData>>
) {
  let refreshNow: number = Date.now();
  let cachedData: TData | null = null;
  let currentPromise: Promise<ApiSuccessResponse<TData>> | null = null;

  return async function memo(client: Client): Promise<TData | null> {
    const now = Date.now();

    if (now < refreshNow) {
      return cachedData;
    }

    try {
      if (!currentPromise) {
        currentPromise = cb(client);
      }

      const { data } = await currentPromise;

      refreshNow = now + 1000;
      cachedData = data;
      currentPromise = null;

      return data;
    } catch (error) {
      console.error(error);
      currentPromise = null;
    }

    return null;
  };
}
