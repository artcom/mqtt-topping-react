import { MqttClient, type MqttClientOptions } from "@artcom/mqtt-topping"
import { useEffect, useRef, useState } from "react"

import { type MqttContextValue } from "./MqttContext"

interface ConnectionPromiseState {
  promise: Promise<void>
  resolve: () => void
  reject: (reason?: unknown) => void
}

const createConnectionPromiseState = (): ConnectionPromiseState => {
  let resolve!: () => void
  let reject!: (reason?: unknown) => void

  const promise = new Promise<void>((res, rej) => {
    resolve = res
    reject = rej
  })

  return { promise, resolve, reject }
}

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
  const [status, setStatus] = useState<MqttContextValue["status"]>("connecting")
  const [error, setError] = useState<Error | null>(null)
  const [connectionPromiseState, setConnectionPromiseState] =
    useState<ConnectionPromiseState>(() => createConnectionPromiseState())

  const clientRef = useRef<MqttClient | null>(null)

  useEffect(() => {
    let isMounted = true

    const connect = async () => {
      setStatus("connecting")
      setError(null)

      // Create a new promise for this connection attempt
      const nextConnection = createConnectionPromiseState()
      setConnectionPromiseState(nextConnection)

      try {
        const mqttClient = await MqttClient.connect(uri, options)

        if (isMounted) {
          clientRef.current = mqttClient
          setClient(mqttClient)
          setStatus("connected")
          nextConnection.resolve()
        } else {
          void mqttClient.disconnect()
        }
      } catch (err) {
        if (isMounted) {
          console.error("Failed to connect to MQTT broker:", err)
          setError(err instanceof Error ? err : new Error(String(err)))
          setStatus("error")
          nextConnection.reject(err)
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

  return {
    client,
    status,
    error,
    connectionPromise: connectionPromiseState.promise,
  }
}
