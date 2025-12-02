import { HttpClient } from "@artcom/mqtt-topping"

import { useMqttContext } from "./MqttProvider/MqttContext"

/**
 * Hook to access the HTTP client instance.
 *
 * @returns The HTTP client instance or null if not available.
 */
export function useHttpClient(): HttpClient | null {
  const { httpClient } = useMqttContext()
  return httpClient
}
