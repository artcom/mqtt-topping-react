import React, { createContext, useMemo, ReactNode, FC } from "react"
import type {
  MqttClient,
  HttpClient,
  MqttPublishOptions,
  MqttSubscribeOptions,
  MqttQoS,
  MessageCallback,
  HttpQuery,
  HttpQueryResult,
  HttpBatchQueryResult,
  HttpJsonResult,
} from "@artcom/mqtt-topping"

interface MqttContextValue {
  mqttClient: MqttClient | null
  httpClient: HttpClient | null
  publish: (topic: string, data: unknown, opts?: MqttPublishOptions) => Promise<unknown>
  unpublish: (topic: string, qos?: MqttQoS) => Promise<unknown>
  subscribe: (
    topic: string,
    callback: MessageCallback,
    opts?: MqttSubscribeOptions,
  ) => Promise<void>
  unsubscribe: (topic: string, callback: MessageCallback) => Promise<unknown>
  query: (query: HttpQuery) => Promise<HttpQueryResult>
  queryBatch: (queries: HttpQuery[]) => Promise<HttpBatchQueryResult>
  queryJson: (topic: string) => Promise<HttpJsonResult>
  queryJsonBatch: (topics: string[]) => Promise<Array<HttpJsonResult | Error>>
}

const defaultContextValue: MqttContextValue = {
  mqttClient: null,
  httpClient: null,
  publish: () =>
    Promise.reject(new Error("useMqttSubscribe: MqttClient not available in context.")),
  unpublish: () =>
    Promise.reject(new Error("useMqttSubscribe: MqttClient not available in context.")),
  subscribe: () =>
    Promise.reject(new Error("useMqttSubscribe: MqttClient not available in context.")),
  unsubscribe: () =>
    Promise.reject(new Error("useMqttSubscribe: MqttClient not available in context.")),
  query: () => Promise.reject(new Error("useQuery: HttpClient not available in context.")),
  queryBatch: () =>
    Promise.reject(new Error("useQueryBatch: HttpClient not available in context.")),
  queryJson: () => Promise.reject(new Error("useQueryJson: HttpClient not available in context.")),
  queryJsonBatch: () =>
    Promise.reject(new Error("useQueryJsonBatch: HttpClient not available in context.")),
}

const MqttContext = createContext<MqttContextValue>(defaultContextValue)

interface MqttProviderProps {
  children: ReactNode
  mqttClient?: MqttClient | null
  httpClient?: HttpClient | null
}

const MqttProvider: FC<MqttProviderProps> = ({
  children,
  mqttClient = null,
  httpClient = null,
}) => {
  const contextValue = useMemo<MqttContextValue>(() => {
    const value: Partial<MqttContextValue> = { mqttClient, httpClient }

    if (mqttClient) {
      value.publish = mqttClient.publish.bind(mqttClient)
      value.unpublish = mqttClient.unpublish.bind(mqttClient)
      value.subscribe = mqttClient.subscribe.bind(mqttClient)
      value.unsubscribe = mqttClient.unsubscribe.bind(mqttClient)
    }

    if (httpClient) {
      value.query = httpClient.query.bind(httpClient)
      value.queryBatch = httpClient.queryBatch.bind(httpClient)
      value.queryJson = httpClient.queryJson.bind(httpClient)
      value.queryJsonBatch = httpClient.queryJsonBatch.bind(httpClient)
    }

    return { ...defaultContextValue, ...value }
  }, [mqttClient, httpClient])

  return <MqttContext.Provider value={contextValue}>{children}</MqttContext.Provider>
}

export { MqttContext, MqttProvider }
export type { MqttContextValue }
