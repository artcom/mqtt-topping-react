// Export all types
export type {
  // Provider types
  MqttProviderProps,
  MqttContextValue,

  // Hook types
  UseMqttSubscribeOptions,
  UseMqttSubscribeResult,
  UseQueryResult,
  UseHttpQueryResult,
  UseHttpQueryBatchResult,
  UseHttpQueryJsonResult,
  UseHttpQueryJsonBatchResult,
  QueryHookOptions,

  // Re-exported types from mqtt-topping
  // Note: MqttClient and HttpClient are exported as classes below, not types
  MqttResult,
  MessageCallback,
  MqttClientOptions,
  MqttSubscribeOptions,
  MqttPublishOptions,
  MqttQoS,
  MqttPayloadParseType,
  SubscriptionHandler,
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

  // TanStack Query types
  QueryKey,
  QueryClient,
  UseQueryOptions,
} from "./types"

// Re-export classes and functions from mqtt-topping
export { MqttClient, HttpClient } from "mqtt-topping"

// Backward compatibility exports for original API
export { connectAsync, createHttpClient } from "./compatibility"

// Status constants for backward compatibility with original async-task-hook API
// Using a const assertion object for better type safety and organization
export const QueryStatus = {
  RUNNING: "pending",
  FINISHED: "success",
  ERROR: "error",
} as const

// Individual exports for backward compatibility
export const RUNNING = QueryStatus.RUNNING
export const FINISHED = QueryStatus.FINISHED
export const ERROR = QueryStatus.ERROR

// Components and hooks
export { MqttProvider, MqttContext, useMqttContext } from "./mqttProvider"
export { useMqttSubscribe } from "./useMqttSubscribe"
export { useQuery } from "./useQuery"
export { useQueryBatch } from "./useQueryBatch"
export { useQueryJson } from "./useQueryJson"
export { useQueryJsonBatch } from "./useQueryJsonBatch"

// TanStack Query utilities
export {
  queryKeys,
  errorHandling,
  retryConfig,
  queryClientConfig,
  cacheUtils,
} from "./queryUtils"
