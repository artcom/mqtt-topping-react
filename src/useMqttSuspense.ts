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
    // eslint-disable-next-line @typescript-eslint/only-throw-error
    throw error
  }

  if (connectionPromise) {
    // eslint-disable-next-line @typescript-eslint/only-throw-error
    throw connectionPromise
  }
}
