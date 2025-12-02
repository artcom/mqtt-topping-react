import {
  useQuery,
  type UseQueryOptions,
  type UseQueryResult,
} from "@tanstack/react-query"

import { useMqttContext } from "./MqttProvider/MqttContext"
import { useHttpClient } from "./useHttpClient"

/**
 * Hook to query multiple MQTT topics via HTTP in a batch.
 *
 * @param topics - The topics to query.
 * @param options - Optional React Query options.
 * @returns The query result containing an array of results.
 */
export function useMqttQueryBatch<TQueryFnData = unknown, TData = TQueryFnData>(
  topics: string[],
  options?: Omit<
    UseQueryOptions<TQueryFnData, Error, TData>,
    "queryKey" | "queryFn"
  >,
): UseQueryResult<TData> {
  const client = useHttpClient()
  const { httpBrokerUri, httpOptions } = useMqttContext()

  return useQuery({
    ...options,
    queryKey: ["mqtt", "batch", topics, httpBrokerUri, httpOptions],
    queryFn: async () => {
      if (!client) {
        throw new Error(
          "HttpClient is not available. Make sure MqttProvider has httpBrokerUri set.",
        )
      }
      const result = await client.queryJsonBatch(topics)
      return result as TQueryFnData
    },
    enabled: !!client && options?.enabled !== false,
  })
}
