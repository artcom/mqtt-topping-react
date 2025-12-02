import { useMqttContext } from "./MqttProvider/MqttContext"

/**
 * Hook to access the MQTT connection status.
 *
 * @returns The connection status and any error.
 */
export function useMqttStatus() {
  const { status, error } = useMqttContext()
  return { status, error }
}
