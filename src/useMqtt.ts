import { MqttClient } from "@artcom/mqtt-topping"

import { useMqttContext } from "./MqttProvider/MqttContext"

/**
 * Hook to access the MQTT client instance.
 *
 * @returns The MQTT client instance or null if not connected.
 */
export function useMqtt(): MqttClient | null {
  const { client } = useMqttContext()
  return client
}
