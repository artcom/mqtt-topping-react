import { useMqttContext } from "./MqttProvider/MqttContext"

/**
 * Hook that suspends until the MQTT client is connected.
 * Throws the connection promise if connecting.
 * Throws the error if connection failed.
 */
export function useMqttSuspense(): void {
  const { status, error, connectionPromise } = useMqttContext()

  if (status === "connected") {
    return
  }

  if (status === "error") {
    throw error ?? new Error("MQTT connection failed")
  }

  if (connectionPromise) {
    const suspense = connectionPromise as Promise<void> & Error
    throw suspense
  }
}
