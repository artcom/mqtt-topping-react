/**
 * Backward compatibility functions for the original mqtt-topping-react API
 * These functions maintain the same interface as the original library
 */
import { HttpClient, MqttClient } from "mqtt-topping"

import type { MqttClientOptions } from "./types"

/**
 * Connect to MQTT broker - backward compatibility wrapper
 * @param uri - MQTT broker URI (ws://, wss://, mqtt://, etc.)
 * @param options - Connection options
 * @returns Promise<MqttClient> - Connected MQTT client
 */
export async function connectAsync(
  uri: string,
  options: MqttClientOptions = {},
): Promise<MqttClient> {
  if (!uri || typeof uri !== "string") {
    throw new Error("connectAsync requires a valid URI string")
  }

  try {
    return await MqttClient.connect(uri, options)
  } catch (error) {
    // Enhance error with connection context for backward compatibility
    const enhancedError = new Error(
      `Failed to connect to MQTT broker at "${uri}": ${error instanceof Error ? error.message : String(error)}`,
    )
    enhancedError.cause = error
    throw enhancedError
  }
}

/**
 * Create HTTP client - backward compatibility wrapper
 * @param url - HTTP server URL
 * @returns HttpClient - HTTP client instance
 */
export function createHttpClient(url: string): HttpClient {
  if (!url || typeof url !== "string") {
    throw new Error("createHttpClient requires a valid URL string")
  }

  try {
    // Validate URL format
    new URL(url)
    return new HttpClient(url)
  } catch (error) {
    if (error instanceof TypeError && error.message.includes("Invalid URL")) {
      throw new Error(
        `Invalid HTTP client URL: "${url}". Must be a valid HTTP/HTTPS URL.`,
      )
    }
    throw error
  }
}
