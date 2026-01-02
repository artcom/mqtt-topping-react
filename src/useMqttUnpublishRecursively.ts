import { MqttClient } from "@artcom/mqtt-topping"

type UnpublishRecursivelyOptions = NonNullable<
  Parameters<MqttClient["unpublishRecursively"]>[2]
>

import { useCallback } from "react"

import { useHttpClient } from "./useHttpClient"
import { useMqtt } from "./useMqtt"

/**
 * Hook to unpublish a topic and all its subtopics recursively.
 *
 * @returns A function to unpublish recursively.
 */
export function useMqttUnpublishRecursively() {
  const client = useMqtt()
  const httpClient = useHttpClient()

  const unpublishRecursively = useCallback(
    async (topic: string, options?: UnpublishRecursivelyOptions) => {
      if (!client) {
        throw new Error("MQTT client is not connected")
      }
      if (!httpClient) {
        throw new Error("HTTP client is not available")
      }

      return client.unpublishRecursively(topic, httpClient, options)
    },
    [client, httpClient],
  )

  return unpublishRecursively
}
