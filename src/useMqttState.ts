import { useState } from "react"

import { useMqttSubscribe } from "./useMqttSubscribe"

/**
 * Hook to subscribe to an MQTT topic and keep the latest message in state.
 *
 * @param topic - The topic to subscribe to.
 * @returns The latest message payload or undefined if no message received yet.
 */
export function useMqttState<T = unknown>(
  topic: string,
  initialValue?: T,
): T | undefined {
  const [payload, setPayload] = useState<T | undefined>(initialValue)

  useMqttSubscribe<T>(topic, (newPayload) => {
    setPayload(newPayload)
  })

  return payload
}
