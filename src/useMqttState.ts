import { useState } from "react"

import { useMqttSubscribe } from "./useMqttSubscribe"

/**
 * Hook to subscribe to an MQTT topic and keep the latest message in state.
 *
 * @param topic - The topic to subscribe to.
 * @returns The latest message payload or undefined if no message received yet.
 */
// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
export function useMqttState<T = unknown>(topic: string): T | undefined {
  const [payload, setPayload] = useState<T | undefined>(undefined)

  useMqttSubscribe<T>(topic, (newPayload) => {
    setPayload(newPayload)
  })

  return payload
}
