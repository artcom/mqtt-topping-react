import {
  HttpClient,
  type HttpClientOptions,
  type MqttClientOptions,
} from "@artcom/mqtt-topping"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import React, { Suspense, useMemo } from "react"

import { useMqttSuspense } from "../useMqttSuspense"
import { MqttContext } from "./MqttContext"
import { useMqttConnection } from "./useMqttConnection"

export interface MqttProviderProps {
  uri: string
  options?: MqttClientOptions
  httpBrokerUri?: string
  httpOptions?: HttpClientOptions
  children: React.ReactNode
  suspenseFallback?: React.ReactNode
}

function MqttSuspenseGate({ children }: { children: React.ReactNode }) {
  useMqttSuspense()
  return <>{children}</>
}

const defaultQueryClient = new QueryClient()

/**
 * Provider component for MQTT context.
 * Manages the MQTT connection and provides the client instance to children.
 *
 * @param props - The provider props.
 * @param props.uri - The broker URI to connect to.
 * @param props.options - Optional MQTT client options.
 * @param props.httpBrokerUri - Optional HTTP broker URI for query support.
 * @param props.httpOptions - Optional HTTP client options.
 * @param props.children - Child components.
 * @param props.suspenseFallback - Optional fallback UI to show while connecting.
 */
export function MqttProvider({
  uri,
  options,
  httpBrokerUri,
  httpOptions,
  children,
  suspenseFallback,
}: MqttProviderProps) {
  const serializedOptions = JSON.stringify(options)
  const stableOptions = useMemo(
    () => options,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [serializedOptions],
  )

  const { client, status, error, connectionPromise } = useMqttConnection(
    uri,
    stableOptions,
  )

  const serializedHttpOptions = JSON.stringify(httpOptions)
  const stableHttpOptions = useMemo(
    () => httpOptions,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [serializedHttpOptions],
  )

  const httpClient = useMemo(() => {
    if (!httpBrokerUri) return null
    return new HttpClient(httpBrokerUri, stableHttpOptions)
  }, [httpBrokerUri, stableHttpOptions])

  const content = suspenseFallback ? (
    <Suspense fallback={suspenseFallback}>
      <MqttSuspenseGate>{children}</MqttSuspenseGate>
    </Suspense>
  ) : (
    children
  )

  return (
    <QueryClientProvider client={defaultQueryClient}>
      <MqttContext.Provider
        value={{
          client,
          httpClient,
          httpBrokerUri,
          httpOptions: stableHttpOptions,
          status,
          error,
          connectionPromise,
        }}
      >
        {content}
      </MqttContext.Provider>
    </QueryClientProvider>
  )
}
