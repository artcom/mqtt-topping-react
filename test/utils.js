export function createMqttClientMock() {
  return {
    publish: jest.fn(),
    unpublish: jest.fn(),
    subscribe: jest.fn(),
    unsubscribe: jest.fn()
  }
}

export function createHttpClientMock() {
  return {
    query: jest.fn(),
    queryBatch: jest.fn(),
    queryJson: jest.fn(),
    queryJsonBatch: jest.fn()
  }
}
