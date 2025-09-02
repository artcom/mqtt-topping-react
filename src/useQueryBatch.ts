import { useQuery as useTanStackQuery } from "@tanstack/react-query"

import { useMqttContext } from "./mqttProvider"
import { queryKeys, retryConfig } from "./queryUtils"
import type {
  HttpQuery,
  QueryHookOptions,
  UseHttpQueryBatchResult,
} from "./types"

/**
 * Hook for making batch HTTP queries using TanStack Query with HttpClient
 *
 * @param queries - Array of HTTP query configurations (topic, depth, flatten, parseJson)
 * @param options - Optional TanStack Query options for customizing behavior
 * @returns UseQueryResult with proper typing for HttpBatchQueryResult
 */
export function useQueryBatch<P = unknown, E = unknown>(
  queries: HttpQuery[],
  options: QueryHookOptions = {},
): UseHttpQueryBatchResult<P, E> {
  const { httpClient } = useMqttContext()

  // Generate query key based on queries array
  const queryKey = queryKeys.httpQueryBatch(queries)

  // Query function that uses the HttpClient
  const queryFn = async () => {
    if (!httpClient) {
      throw new Error(
        `HttpClient not available for batch query (${queries.length} queries). Make sure MqttProvider has httpClient prop.`,
      )
    }

    if (queries.length === 0) {
      throw new Error("Cannot execute batch query with empty queries array")
    }

    try {
      return await httpClient.queryBatch(queries)
    } catch (error) {
      // Enhance error with batch context
      const topics = queries.map((q) => q.topic).join(", ")
      const enhancedError = new Error(
        `HTTP batch query failed for topics [${topics}]: ${error instanceof Error ? error.message : String(error)}`,
      )
      enhancedError.name =
        error instanceof Error ? error.name : "HttpBatchQueryError"
      enhancedError.cause = error
      throw enhancedError
    }
  }

  // Determine if query should be enabled
  const shouldEnable = httpClient !== undefined && queries.length > 0
  const isExplicitlyDisabled = options.enabled === false
  const finalEnabled = shouldEnable && !isExplicitlyDisabled

  // Merge default retry configuration with user options
  const queryOptions = {
    ...retryConfig.default,
    ...options,
    queryKey,
    queryFn,
    enabled: finalEnabled,
  }

  return useTanStackQuery(queryOptions) as UseHttpQueryBatchResult<P, E>
}
