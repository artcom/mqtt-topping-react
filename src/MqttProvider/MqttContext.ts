import { HttpClient, MqttClient } from "@artcom/mqtt-topping"
import { createContext, useContext } from "react"

export interface MqttContextValue {
  client: MqttClient | null
  httpClient: HttpClient | null
  httpBrokerUri: string | undefined
  httpOptions: ConstructorParameters<typeof HttpClient>[1]
  status: "connecting" | "connected" | "error" | "disconnected"
  error: Error | null
  connectionPromise: Promise<void> | null
}

export const MqttContext = createContext<MqttContextValue | null>(null)

export function useMqttContext() {
  const context = useContext(MqttContext)
  if (!context) {
    throw new Error("useMqttContext must be used within an MqttProvider")
  }
  return context
}
