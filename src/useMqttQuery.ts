import {
  useQuery,
  type UseQueryOptions,
  type UseQueryResult,
} from "@tanstack/react-query"

import { useMqttContext } from "./MqttProvider/MqttContext"
import { useHttpClient } from "./useHttpClient"

/**
 * Hook to query an MQTT topic via HTTP.
 *
 * @param topic - The topic to query.
 * @param options - Optional React Query options.
 * @returns The query result.
 */
export function useMqttQuery<TQueryFnData = unknown, TData = TQueryFnData>(
  topic: string,
  options?: Omit<
    UseQueryOptions<TQueryFnData, Error, TData>,
    "queryKey" | "queryFn"
  >,
): UseQueryResult<TData> {
  const client = useHttpClient()
  const { httpBrokerUri, httpOptions } = useMqttContext()

  return useQuery({
    ...options,
    queryKey: ["mqtt", topic, httpBrokerUri, httpOptions],
    queryFn: async () => {
      if (!client) {
        throw new Error(
          "HttpClient is not available. Make sure MqttProvider has httpBrokerUri set.",
        )
      }
      const result = await client.queryJson(topic)
      return result as TQueryFnData
    },
    enabled: !!client && options?.enabled !== false,
  })
}
