import React, { createContext, memo, useContext, useMemo } from "react"

import type {
  MessageCallback,
  MqttContextValue,
  MqttProviderProps,
  MqttPublishOptions,
  MqttQoS,
  MqttSubscribeOptions,
} from "./types"

// Create the MQTT context with proper typing
export const MqttContext = createContext<MqttContextValue>({})

// Custom hook to use the MQTT context
export const useMqttContext = () => {
  const context = useContext(MqttContext)
  return context
}

// MqttProvider component implementation with memo optimization
const MqttProviderComponent: React.FC<MqttProviderProps> = ({
  children,
  mqttClient,
  httpClient,
}) => {
  // Create bound methods for convenience
  const contextValue = useMemo<MqttContextValue>(() => {
    const value: MqttContextValue = {}

    // Only assign clients if they exist (avoid undefined assignment with exactOptionalPropertyTypes)
    if (mqttClient) {
      value.mqttClient = mqttClient
    }
    if (httpClient) {
      value.httpClient = httpClient
    }

    // Add bound methods if mqttClient is available
    if (mqttClient) {
      value.publish = async (
        topic: string,
        data: unknown,
        opts?: MqttPublishOptions,
      ) => {
        return mqttClient.publish(topic, data, opts)
      }

      value.unpublish = async (topic: string, qos?: MqttQoS) => {
        return mqttClient.unpublish(topic, qos)
      }

      value.subscribe = async (
        topic: string,
        callback: MessageCallback,
        opts?: MqttSubscribeOptions,
      ): Promise<void> => {
        return mqttClient.subscribe(topic, callback, opts)
      }

      value.unsubscribe = async (topic: string, callback: MessageCallback) => {
        return mqttClient.unsubscribe(topic, callback)
      }

      // Add unpublishRecursively method using HttpClient if available
      if (httpClient) {
        value.unpublishRecursively = async (topic: string, qos?: MqttQoS) => {
          try {
            // Normalize topic for wildcard query
            const normalizedTopic = topic.endsWith("/") ? topic : topic + "/"
            const wildcardTopic = normalizedTopic + "#"

            // Query all subtopics first
            const queryResult = await httpClient.query({
              topic: wildcardTopic,
              depth: -1,
              flatten: true,
            })

            // Extract topics from query result with better error handling
            let topicsToUnpublish: string[] = []

            if (Array.isArray(queryResult)) {
              topicsToUnpublish = queryResult
                .map((item) => item.topic)
                .filter(
                  (t): t is string => typeof t === "string" && t.length > 0,
                )
            } else if (
              queryResult &&
              typeof queryResult === "object" &&
              "topic" in queryResult
            ) {
              const topicValue = queryResult.topic
              if (typeof topicValue === "string" && topicValue.length > 0) {
                topicsToUnpublish = [topicValue]
              }
            }

            // Always include the base topic itself
            if (!topicsToUnpublish.includes(topic)) {
              topicsToUnpublish.unshift(topic)
            }

            // Unpublish each topic individually with better error context
            const results = await Promise.allSettled(
              topicsToUnpublish.map(async (t) => {
                try {
                  return await mqttClient.unpublish(t, qos)
                } catch (error) {
                  // Enhance error with topic context
                  const enhancedError = new Error(
                    `Failed to unpublish topic "${t}": ${error instanceof Error ? error.message : String(error)}`,
                  )
                  enhancedError.cause = error
                  throw enhancedError
                }
              }),
            )

            return results
          } catch (error) {
            // If query fails, still try to unpublish the base topic
            console.warn(
              "Failed to query subtopics for recursive unpublish, attempting base topic only:",
              error,
            )
            const fallbackResult = await Promise.allSettled([
              mqttClient.unpublish(topic, qos),
            ])
            return fallbackResult
          }
        }
      }
    }

    return value
  }, [mqttClient, httpClient])

  // Note: No cleanup effect needed here as:
  // 1. The mqtt-topping library handles cleanup internally
  // 2. Individual hooks manage their own subscriptions
  // 3. The client might be used elsewhere and shouldn't be disconnected by the provider

  return (
    <MqttContext.Provider value={contextValue}>{children}</MqttContext.Provider>
  )
}

// Export memoized version to prevent unnecessary re-renders when props haven't changed
export const MqttProvider = memo(
  MqttProviderComponent,
) as React.FC<MqttProviderProps>
