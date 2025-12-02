import { MqttClient, type MqttClientOptions } from "@artcom/mqtt-topping"
import { useEffect, useRef, useState } from "react"

import { type MqttContextValue } from "./MqttContext"

/**
 * Hook to manage the MQTT connection lifecycle.
 *
 * @param uri - The broker URI to connect to.
 * @param options - Optional MQTT client options.
 * @returns The connection state including client, status, and error.
 */
export function useMqttConnection(
  uri: string,
  options?: MqttClientOptions,
): Pick<MqttContextValue, "client" | "status" | "error" | "connectionPromise"> {
  const [client, setClient] = useState<MqttClient | null>(null)
  const [status, setStatus] =
    useState<MqttContextValue["status"]>("disconnected")
  const [error, setError] = useState<Error | null>(null)
  const [connectionPromise, setConnectionPromise] =
    useState<Promise<void> | null>(null)
  const resolverRef = useRef<(() => void) | null>(null)

  const clientRef = useRef<MqttClient | null>(null)

  useEffect(() => {
    let isMounted = true

    const connect = async () => {
      setStatus("connecting")
      setError(null)

      // Create a new promise for this connection attempt
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      let resolve: () => void = () => {}
      const promise = new Promise<void>((r) => {
        resolve = r
      })
      resolverRef.current = resolve
      setConnectionPromise(promise)

      try {
        const mqttClient = await MqttClient.connect(uri, options)

        if (isMounted) {
          clientRef.current = mqttClient
          setClient(mqttClient)
          setStatus("connected")
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
          if (resolverRef.current) {
            resolverRef.current()
            resolverRef.current = null
          }
        } else {
          void mqttClient.disconnect()
        }
      } catch (err) {
        if (isMounted) {
          console.error("Failed to connect to MQTT broker:", err)
          setError(err instanceof Error ? err : new Error(String(err)))
          setStatus("error")
          // We don't resolve the promise on error, so Suspense might hang?
          // Or we should reject it? If we reject, Suspense throws.
          // Let's reject it so ErrorBoundary catches it.
          // Actually, better to resolve it and let the hook check 'status' and throw the error object.
          if (resolverRef.current) {
            resolverRef.current()
            resolverRef.current = null
          }
        }
      }
    }

    void connect()

    return () => {
      isMounted = false
      if (clientRef.current) {
        void clientRef.current.disconnect()
        clientRef.current = null
        setClient(null)
        setStatus("disconnected")
      }
    }
  }, [uri, options])

  return { client, status, error, connectionPromise }
}
