import { useQuery as useTanStackQuery } from "@tanstack/react-query"

import { useMqttContext } from "./mqttProvider"
import { queryKeys, retryConfig } from "./queryUtils"
import type { HttpQuery, QueryHookOptions, UseHttpQueryResult } from "./types"

/**
 * Hook for making HTTP queries using TanStack Query with HttpClient
 *
 * @param query - The HTTP query configuration (topic, depth, flatten, parseJson)
 * @param options - Optional TanStack Query options for customizing behavior
 * @returns UseQueryResult with proper typing for HttpQueryResult
 */
export function useQuery<P = unknown>(
  query: HttpQuery,
  options: QueryHookOptions = {},
): UseHttpQueryResult<P> {
  const { httpClient } = useMqttContext()

  // Generate query key based on query parameters
  const queryKey = queryKeys.httpQuery(query)

  // Query function that uses the HttpClient
  const queryFn = async () => {
    if (!httpClient) {
      throw new Error(
        `HttpClient not available for query "${query.topic}". Make sure MqttProvider has httpClient prop.`,
      )
    }

    try {
      return await httpClient.query(query)
    } catch (error) {
      // Enhance error with query context
      const enhancedError = new Error(
        `HTTP query failed for topic "${query.topic}": ${error instanceof Error ? error.message : String(error)}`,
      )
      enhancedError.name =
        error instanceof Error ? error.name : "HttpQueryError"
      enhancedError.cause = error
      throw enhancedError
    }
  }

  // Determine if query should be enabled
  const shouldEnable = httpClient !== undefined
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

  return useTanStackQuery(queryOptions) as UseHttpQueryResult<P>
}
