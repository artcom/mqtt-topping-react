import { MqttClient, HttpClient } from "@artcom/mqtt-topping"

export type MockMqttClient = Partial<jest.Mocked<MqttClient>>
export type MockHttpClient = Partial<jest.Mocked<HttpClient>>

export function createMqttClientMock(): MockMqttClient {
  return {
    publish: jest.fn().mockResolvedValue(undefined),
    unpublish: jest.fn().mockResolvedValue(undefined),
    subscribe: jest.fn().mockResolvedValue(undefined),
    unsubscribe: jest.fn().mockResolvedValue(undefined),
    isConnected: jest.fn().mockReturnValue(true),
    disconnect: jest.fn().mockResolvedValue(undefined),
  }
}

export function createHttpClientMock(): MockHttpClient {
  return {
    query: jest.fn().mockResolvedValue({ topic: "mock", payload: {} }),
    queryBatch: jest.fn().mockResolvedValue([]),
    queryJson: jest.fn().mockResolvedValue({}),
    queryJsonBatch: jest.fn().mockResolvedValue([]),
  }
}
