import type { ReactNode } from "react"

import type { UseQueryResult as TanStackUseQueryResult } from "@tanstack/react-query"

import type {
  HttpBatchQueryResult,
  HttpClient,
  HttpJsonResult,
  HttpQueryResult,
  MessageCallback,
  MqttClient,
  MqttPublishOptions,
  MqttQoS,
  MqttResult,
  MqttSubscribeOptions,
} from "mqtt-topping"

// Re-export TanStack Query types that are actually used
export type {
  QueryKey,
  QueryClient,
  UseQueryOptions,
} from "@tanstack/react-query"

// Re-export all relevant types from mqtt-topping library
export type {
  // MQTT Client and related types
  MqttClient,
  HttpClient,
  MessageCallback,
  MqttClientOptions,
  MqttSubscribeOptions,
  MqttPublishOptions,
  MqttQoS,
  MqttPayloadParseType,
  SubscriptionHandler,
  MqttResult,

  // HTTP Query types
  HttpQuery,
  HttpQueryResult,
  HttpBatchQueryResult,
  HttpJsonResult,
  HttpTopicResult,
  HttpFlatTopicResult,
  HttpBatchQueryResponse,
  HttpErrorResult,

  // Error types
  MqttToppingError,
  MqttError,
  InvalidTopicError,
  MqttConnectionError,
  MqttSubscribeError,
  MqttUnsubscribeError,
  MqttPublishError,
  MqttPayloadError,
  MqttUsageError,
  MqttDisconnectError,
  HttpError,
  HttpNetworkError,
  HttpTimeoutError,
  HttpRequestError,
  HttpQueryError,
  HttpPayloadParseError,
  HttpServerError,
  HttpProcessingError,
} from "mqtt-topping"

// Provider interfaces
export interface MqttProviderProps {
  children: ReactNode
  mqttClient?: MqttClient
  httpClient?: HttpClient
}

export interface MqttContextValue {
  mqttClient?: MqttClient
  httpClient?: HttpClient
  // Bound methods for convenience
  publish?: (
    topic: string,
    data: unknown,
    opts?: MqttPublishOptions,
  ) => Promise<MqttResult | void>
  unpublish?: (topic: string, qos?: MqttQoS) => Promise<MqttResult | void>
  subscribe?: (
    topic: string,
    callback: MessageCallback,
    opts?: MqttSubscribeOptions,
  ) => Promise<void>
  unsubscribe?: (
    topic: string,
    callback: MessageCallback,
  ) => Promise<MqttResult | void>
  unpublishRecursively?: (
    topic: string,
    qos?: MqttQoS,
  ) => Promise<PromiseSettledResult<MqttResult | void>[]>
}

// MQTT Subscription hook interfaces
export interface UseMqttSubscribeOptions extends MqttSubscribeOptions {
  enabled?: boolean // Allow conditional subscription
}

export interface UseMqttSubscribeResult {
  isSubscribed: boolean
  error: Error | null
}

// Query hook return types using TanStack Query's UseQueryResult
export type UseQueryResult<
  TData = unknown,
  TError = Error,
> = TanStackUseQueryResult<TData, TError>

// Specific query result types for each hook
export type UseHttpQueryResult<P = unknown> = UseQueryResult<
  HttpQueryResult<P>,
  Error
>

export type UseHttpQueryBatchResult<P = unknown, E = unknown> = UseQueryResult<
  HttpBatchQueryResult<P, E>,
  Error
>

export type UseHttpQueryJsonResult = UseQueryResult<HttpJsonResult, Error>

export type UseHttpQueryJsonBatchResult = UseQueryResult<
  Array<HttpJsonResult | Error>,
  Error
>

// Query options that can be passed to TanStack Query hooks
// Updated to use current TanStack Query v5 options
export interface QueryHookOptions {
  enabled?: boolean
  refetchInterval?: number | false | ((query: any) => number | false)
  refetchIntervalInBackground?: boolean
  refetchOnMount?: boolean | "always"
  refetchOnReconnect?: boolean | "always"
  refetchOnWindowFocus?: boolean | "always"
  retry?: boolean | number | ((failureCount: number, error: Error) => boolean)
  retryDelay?: number | ((retryAttempt: number, error: Error) => number)
  staleTime?: number
  gcTime?: number // Updated from deprecated cacheTime
  suspense?: boolean
  throwOnError?: boolean | ((error: Error) => boolean) // Updated from useErrorBoundary
  select?: <T>(data: any) => T
  // Removed deprecated onSuccess, onError, onSettled - use mutations or separate effects instead
}
