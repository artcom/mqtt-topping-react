import { startTransition, useEffect, useMemo, useRef, useState } from "react"

import { useMqttContext } from "./mqttProvider"
import type {
  MessageCallback,
  UseMqttSubscribeOptions,
  UseMqttSubscribeResult,
} from "./types"

/**
 * Hook for subscribing to MQTT topics with automatic cleanup and state management
 *
 * @param topic - The MQTT topic to subscribe to
 * @param handler - The callback function to handle incoming messages
 * @param options - Optional subscription options including enabled flag
 * @returns Object containing subscription status and error state
 */
export function useMqttSubscribe(
  topic: string,
  handler: MessageCallback,
  options: UseMqttSubscribeOptions = {},
): UseMqttSubscribeResult {
  const { mqttClient, subscribe, unsubscribe } = useMqttContext()
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  // Use refs to track current values for cleanup
  const isSubscribedRef = useRef<boolean>(false)
  const currentTopicRef = useRef<string>(topic)
  const currentHandlerRef = useRef<MessageCallback>(handler)

  // Extract enabled flag from options, default to true
  const enabled = options.enabled !== false

  // Memoize subscribe options to prevent infinite re-renders
  // Use individual dependencies instead of JSON.stringify for better performance
  const memoizedSubscribeOptions = useMemo(() => {
    const { enabled: _, ...subscribeOpts } = options
    return subscribeOpts
  }, [options.qos, options.parseType, options.customParser, options.properties])

  // Main subscription effect
  useEffect(() => {
    let cancelled = false

    const performSubscription = async () => {
      if (!enabled || cancelled) {
        return
      }

      if (!mqttClient || !subscribe) {
        if (!cancelled) {
          setError(new Error("MQTT client not available"))
          setIsSubscribed(false)
          isSubscribedRef.current = false
        }
        return
      }

      try {
        if (!cancelled) {
          setError(null)
        }

        await subscribe(topic, handler, memoizedSubscribeOptions)

        if (!cancelled) {
          // Use startTransition for non-urgent subscription state updates
          // Only skip in test environment to avoid timing issues
          const updateState = () => setIsSubscribed(true)

          if (process.env.NODE_ENV === "test") {
            updateState()
          } else {
            startTransition(updateState)
          }
          isSubscribedRef.current = true
          currentTopicRef.current = topic
          currentHandlerRef.current = handler
        }
      } catch (err) {
        if (!cancelled) {
          const subscribeError =
            err instanceof Error ? err : new Error("Subscription failed")
          setError(subscribeError)
          setIsSubscribed(false)
          isSubscribedRef.current = false
        }
      }
    }

    const performUnsubscription = async () => {
      if (!mqttClient || !unsubscribe || cancelled) {
        return
      }

      // Only proceed if we're actually subscribed
      if (!isSubscribedRef.current) {
        return
      }

      try {
        await unsubscribe(currentTopicRef.current, currentHandlerRef.current)
        if (!cancelled) {
          // Use startTransition for non-urgent unsubscription state updates
          if (process.env.NODE_ENV === "test") {
            setIsSubscribed(false)
            setError(null)
          } else {
            startTransition(() => {
              setIsSubscribed(false)
              setError(null)
            })
          }
          isSubscribedRef.current = false
        }
      } catch (err) {
        console.warn(
          "Failed to unsubscribe from topic:",
          currentTopicRef.current,
          err,
        )
        // Even if unsubscribe fails, update our internal state
        if (!cancelled) {
          if (process.env.NODE_ENV === "test") {
            setIsSubscribed(false)
          } else {
            startTransition(() => {
              setIsSubscribed(false)
            })
          }
          isSubscribedRef.current = false
        }
      }
    }

    // Handle subscription/unsubscription based on enabled state and current subscription status
    if (enabled) {
      if (!isSubscribedRef.current) {
        // Need to subscribe
        performSubscription()
      } else if (
        currentTopicRef.current !== topic ||
        currentHandlerRef.current !== handler
      ) {
        // Need to resubscribe due to topic/handler change
        performUnsubscription().then(() => {
          if (!cancelled && enabled) {
            performSubscription()
          }
        })
      }
    } else if (!enabled) {
      // When disabled, ensure we're unsubscribed and state reflects that
      if (isSubscribedRef.current) {
        // Need to unsubscribe when disabled
        performUnsubscription()
      } else {
        // Already unsubscribed, just ensure state is correct
        if (!cancelled) {
          setIsSubscribed(false)
          setError(null)
        }
      }
    }

    // Cleanup function
    return () => {
      cancelled = true
      if (isSubscribedRef.current && mqttClient && unsubscribe) {
        // Fire and forget - don't await in cleanup
        unsubscribe(currentTopicRef.current, currentHandlerRef.current).catch(
          (err) => {
            console.warn(
              "Failed to unsubscribe from topic:",
              currentTopicRef.current,
              err,
            )
          },
        )
        isSubscribedRef.current = false
      }
    }
  }, [
    enabled,
    mqttClient,
    subscribe,
    unsubscribe,
    topic,
    handler,
    memoizedSubscribeOptions,
  ])

  return {
    isSubscribed,
    error,
  }
}
