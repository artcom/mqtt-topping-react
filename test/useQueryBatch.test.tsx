import React, { FC } from "react"
import { useAsyncTask, AsyncTask } from "@artcom/async-task-hook"
import { render, act, rerender as rtlRerender } from "@testing-library/react"
import { MqttProvider } from "../src/mqttProvider"
import { useQueryBatch } from "../src"
import { createHttpClientMock, createMqttClientMock, MockHttpClient } from "./utils"
import type { HttpQuery, HttpBatchQueryResult, HttpError } from "@artcom/mqtt-topping"

const mockUseAsyncTask = useAsyncTask as jest.Mock
jest.mock("@artcom/async-task-hook", () => ({
  useAsyncTask: jest.fn(),
}))

const query1: HttpQuery = { topic: "testTopic1", depth: 0, flatten: false, parseJson: false }
const query2: HttpQuery = { topic: "testTopic2", depth: 1, flatten: true, parseJson: true }
const query3: HttpQuery = { topic: "testTopic3", depth: 0, flatten: false, parseJson: false }

const defaultQueries = [query1, query2]

interface TestComponentProps {
  queries?: HttpQuery[]
}

const TestComponent: FC<TestComponentProps> = ({ queries = defaultQueries }) => {
  useQueryBatch(queries)
  return null
}

describe("useQueryBatch", () => {
  let httpClient: MockHttpClient
  let capturedTask: () => Promise<HttpBatchQueryResult>

  beforeEach(() => {
    mockUseAsyncTask.mockImplementation((taskFn) => {
      capturedTask = taskFn
      return { status: "IDLE", result: undefined, error: undefined, run: taskFn }
    })
    httpClient = createHttpClientMock()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it("should pass the correct queries array to httpClient.queryBatch when task runs", async () => {
    render(
      <MqttProvider httpClient={httpClient}>
        <TestComponent queries={defaultQueries} />
      </MqttProvider>,
    )

    expect(mockUseAsyncTask).toHaveBeenCalledTimes(1)
    expect(capturedTask).toBeInstanceOf(Function)

    await act(async () => {
      await capturedTask()
    })

    expect(httpClient.queryBatch).toHaveBeenCalledTimes(1)
    expect(httpClient.queryBatch).toHaveBeenCalledWith(defaultQueries)
  })

  it("should create a new task with updated queries array on rerender", async () => {
    const { rerender } = render(
      <MqttProvider httpClient={httpClient}>
        <TestComponent queries={defaultQueries} />
      </MqttProvider>,
    )
    const task1 = capturedTask

    const updatedQueries = [...defaultQueries, query3]

    rerender(
      <MqttProvider httpClient={httpClient}>
        <TestComponent queries={updatedQueries} />
      </MqttProvider>,
    )

    expect(mockUseAsyncTask).toHaveBeenCalledTimes(2)
    const task2 = capturedTask
    expect(task2).not.toBe(task1)

    await act(async () => {
      await task2()
    })

    expect(httpClient.queryBatch).toHaveBeenCalledTimes(1)
    expect(httpClient.queryBatch).toHaveBeenCalledWith(updatedQueries)
  })

  it("should NOT create a new task if queries array reference is stable (memoized)", () => {
    const stableQueries = [...defaultQueries]

    const { rerender } = render(
      <MqttProvider httpClient={httpClient}>
        <TestComponent queries={stableQueries} />
      </MqttProvider>,
    )
    const task1 = capturedTask

    rerender(
      <MqttProvider httpClient={httpClient}>
        <TestComponent queries={stableQueries} />
      </MqttProvider>,
    )

    expect(mockUseAsyncTask).toHaveBeenCalledTimes(2)
    const task2 = capturedTask
    expect(task2).toBe(task1)
    expect(httpClient.queryBatch).not.toHaveBeenCalled()
  })

  it("should handle absence of httpClient gracefully", async () => {
    render(
      <MqttProvider mqttClient={createMqttClientMock()}>
        <TestComponent queries={defaultQueries} />
      </MqttProvider>,
    )

    expect(mockUseAsyncTask).toHaveBeenCalledTimes(1)
    expect(capturedTask).toBeInstanceOf(Function)

    await act(async () => {
      await expect(capturedTask()).rejects.toThrow(
        "useQueryBatch: HttpClient not available in context.",
      )
    })

    expect(httpClient.queryBatch).not.toHaveBeenCalled()
  })
})
