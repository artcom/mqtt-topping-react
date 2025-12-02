import { useEffect, useRef } from "react"

import { useMqtt } from "./useMqtt"

/**
 * Hook to subscribe to an MQTT topic.
 *
 * @param topic - The topic to subscribe to.
 * @param handler - The callback function to handle incoming messages.
 */
// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
export function useMqttSubscribe<T = unknown>(
  topic: string,
  handler: (payload: T, topic: string) => void,
): void {
  const client = useMqtt()
  const handlerRef = useRef(handler)

  useEffect(() => {
    handlerRef.current = handler
  }, [handler])

  useEffect(() => {
    if (!client || !topic) return

    let isSubscribed = true
    const safeHandler = (payload: unknown, topic: string) => {
      if (isSubscribed) {
        handlerRef.current(payload as T, topic)
      }
    }

    void client.subscribe(topic, safeHandler)

    return () => {
      isSubscribed = false
      void client.unsubscribe(topic, safeHandler)
    }
  }, [client, topic])
}
