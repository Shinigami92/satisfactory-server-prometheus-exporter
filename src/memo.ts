import type {
  ApiSuccessResponse,
  Client,
} from "satisfactory-server-api-client";

export function memoFactory<TData>(
  cb: (client: Client) => Promise<ApiSuccessResponse<TData>>
) {
  let lastNow: number | null = null;
  let lastData: TData | null = null;

  return async function memo(client: Client): Promise<TData | null> {
    const now = Date.now();

    if (lastNow && lastData && now - lastNow < 1000) {
      return lastData;
    }

    try {
      const { data } = await cb(client);

      lastNow = now;
      lastData = data;

      return data;
    } catch (error) {
      console.error(error);
    }

    return null;
  };
}
