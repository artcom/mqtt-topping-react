export type MqttQoS = 0 | 1 | 2
export type MqttPayloadParseType = "string" | "json" | "buffer" | "none"
export type MessageCallback = (payload: any, topic: string, packet: any) => void

export interface MqttSubscribeOptions {
  qos?: MqttQoS
  parseType?: MqttPayloadParseType
  customParser?: (buffer: Buffer) => any
}

export interface MqttPublishOptions {
  qos?: MqttQoS
  retain?: boolean
  parseType?: MqttPayloadParseType
}

export interface HttpQuery {
  topic: string
  depth?: number
  parseType?: MqttPayloadParseType
}

export interface HttpQueryResult {
  topic: string
  payload: any
}

export type HttpBatchQueryResult = HttpQueryResult[]
export type HttpJsonResult = Record<string, any>

export class MqttConnectionError extends Error {}
export class HttpNetworkError extends Error {}
export class HttpServerError extends Error {}
export class HttpTimeoutError extends Error {}
export class HttpRequestError extends Error {}
export class HttpPayloadParseError extends Error {}

export class MqttClient {
  publish = jest.fn().mockResolvedValue(undefined)
  unpublish = jest.fn().mockResolvedValue(undefined)
  subscribe = jest.fn().mockResolvedValue(undefined)
  unsubscribe = jest.fn().mockResolvedValue(undefined)
  isConnected = jest.fn().mockReturnValue(true)
  disconnect = jest.fn().mockResolvedValue(undefined)
}

export class HttpClient {
  query = jest.fn().mockResolvedValue({ topic: "mock", payload: {} })
  queryBatch = jest.fn().mockResolvedValue([])
  queryJson = jest.fn().mockResolvedValue({})
  queryJsonBatch = jest.fn().mockResolvedValue([])
}
