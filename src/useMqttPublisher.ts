import { useMqtt } from "./useMqtt"

/**
 * Hook to publish messages to an MQTT topic.
 *
 * @returns A function to publish messages.
 */
export function useMqttPublisher() {
  const client = useMqtt()

  const publish = (topic: string, payload: unknown) => {
    if (!client) {
      throw new Error("MQTT client is not connected")
    }
    return client.publish(topic, payload)
  }

  return publish
}
