import { useQuery as useTanStackQuery } from "@tanstack/react-query"

import { useMqttContext } from "./mqttProvider"
import { queryKeys, retryConfig } from "./queryUtils"
import type { QueryHookOptions, UseHttpQueryJsonBatchResult } from "./types"

/**
 * Hook for making batch JSON-specific HTTP queries using TanStack Query with HttpClient
 *
 * This hook takes an array of topics and queries each one using the HttpClient's
 * queryJson method. It handles individual JSON parsing errors and returns results
 * for all topics, with errors included in the results array.
 *
 * @param topics - Array of MQTT topics to query (wildcards not supported)
 * @param options - Optional TanStack Query options for customizing behavior
 * @returns UseQueryResult with array of HttpJsonResult or Error for each topic
 */
export function useQueryJsonBatch(
  topics: string[],
  options: QueryHookOptions = {},
): UseHttpQueryJsonBatchResult {
  const { httpClient } = useMqttContext()

  // Generate query key for JSON batch query
  const queryKey = queryKeys.httpQueryJsonBatch(topics)

  // Query function that uses the HttpClient's queryJson method for each topic
  const queryFn = async () => {
    if (!httpClient) {
      throw new Error(
        "HttpClient not available. Make sure MqttProvider has httpClient prop.",
      )
    }

    // Validate that no topics contain wildcards (queryJson doesn't support them)
    // Use regex for more efficient wildcard detection
    const invalidTopics = topics.filter((topic) => /[+#]/.test(topic))
    if (invalidTopics.length > 0) {
      throw new Error(
        `Wildcards (+, #) are not supported in useQueryJsonBatch. Invalid topics: ${invalidTopics.join(", ")}. Use useQueryBatch instead.`,
      )
    }

    // Execute all JSON queries and handle individual errors
    const results = await Promise.allSettled(
      topics.map((topic) => httpClient.queryJson(topic)),
    )

    // Transform Promise.allSettled results to return either the value or the error
    return results.map((result, index) => {
      if (result.status === "fulfilled") {
        return result.value
      } else {
        // Create a more descriptive error that includes the topic
        const originalError = result.reason
        const errorMessage =
          originalError instanceof Error
            ? originalError.message
            : String(originalError)

        const error = new Error(
          `Failed to query JSON for topic "${topics[index]}": ${errorMessage}`,
        )
        error.name =
          originalError instanceof Error
            ? originalError.name
            : "HttpJsonQueryError"
        error.cause = originalError
        return error
      }
    })
  }

  // Determine if query should be enabled
  const shouldEnable = httpClient !== undefined && topics.length > 0
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

  return useTanStackQuery(queryOptions) as UseHttpQueryJsonBatchResult
}
