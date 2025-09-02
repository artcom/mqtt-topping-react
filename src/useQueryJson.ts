import { useQuery as useTanStackQuery } from "@tanstack/react-query"

import { useMqttContext } from "./mqttProvider"
import { queryKeys, retryConfig } from "./queryUtils"
import type { QueryHookOptions, UseHttpQueryJsonResult } from "./types"

/**
 * Hook for making JSON-specific HTTP queries using TanStack Query with HttpClient
 *
 * This hook uses the HttpClient's queryJson method which automatically parses
 * the response as JSON and handles JSON-specific error cases.
 *
 * @param topic - The MQTT topic to query (wildcards not supported)
 * @param options - Optional TanStack Query options for customizing behavior
 * @returns UseQueryResult with proper typing for HttpJsonResult
 */
export function useQueryJson(
  topic: string,
  options: QueryHookOptions = {},
): UseHttpQueryJsonResult {
  const { httpClient } = useMqttContext()

  // Generate query key for JSON query
  const queryKey = queryKeys.httpQueryJson(topic)

  // Query function that uses the HttpClient's queryJson method
  const queryFn = async () => {
    if (!httpClient) {
      throw new Error(
        `HttpClient not available for JSON query "${topic}". Make sure MqttProvider has httpClient prop.`,
      )
    }

    // Validate topic doesn't contain wildcards (queryJson doesn't support them)
    // Use regex for more efficient wildcard detection
    if (/[+#]/.test(topic)) {
      throw new Error(
        `Wildcards (+, #) are not supported in useQueryJson for topic "${topic}". Use useQuery instead.`,
      )
    }

    try {
      return await httpClient.queryJson(topic)
    } catch (error) {
      // Enhance error with JSON query context
      const enhancedError = new Error(
        `JSON query failed for topic "${topic}": ${error instanceof Error ? error.message : String(error)}`,
      )
      enhancedError.name =
        error instanceof Error ? error.name : "HttpJsonQueryError"
      enhancedError.cause = error
      throw enhancedError
    }
  }

  // Determine if query should be enabled
  const shouldEnable = httpClient !== undefined && topic.length > 0
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

  return useTanStackQuery(queryOptions)
}
