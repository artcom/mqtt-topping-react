
import React, { FC } from "react" 
import { useAsyncTask, AsyncTask } from "@artcom/async-task-hook"
import { render, act, rerender as rtlRerender } from "@testing-library/react"
import { MqttProvider } from "../src/mqttProvider"
import { useQueryJsonBatch } from "../src"
import { createHttpClientMock, createMqttClientMock, MockHttpClient } from "./utils"
import type { HttpJsonResult, HttpError } from "@artcom/mqtt-topping"

const mockUseAsyncTask = useAsyncTask as jest.Mock
jest.mock("@artcom/async-task-hook", () => ({
  useAsyncTask: jest.fn(),
}))

const defaultTopics = ["testTopic1", "testTopic2"]
const updatedTopics = ["testTopic1", "testTopic2", "testTopic3"]

type QueryJsonBatchResult = Array<HttpJsonResult | HttpError>

interface TestComponentProps {
  topics?: string[]
}

const TestComponent: FC<TestComponentProps> = ({ topics = defaultTopics }) => {
  useQueryJsonBatch(topics)
  return null
}

describe("useQueryJsonBatch", () => {
  let httpClient: MockHttpClient
  let capturedTask: () => Promise<QueryJsonBatchResult>

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

  it("should pass the correct topics array to httpClient.queryJsonBatch when task runs", async () => {
    render(
      <MqttProvider httpClient={httpClient}>
        <TestComponent topics={defaultTopics} />
      </MqttProvider>,
    )

    expect(mockUseAsyncTask).toHaveBeenCalledTimes(1)
    expect(capturedTask).toBeInstanceOf(Function)

    await act(async () => {
      await capturedTask()
    })

    expect(httpClient.queryJsonBatch).toHaveBeenCalledTimes(1)
    expect(httpClient.queryJsonBatch).toHaveBeenCalledWith(defaultTopics)
  })

  it("should create a new task with updated topics array on rerender", async () => {
    const { rerender } = render(
      <MqttProvider httpClient={httpClient}>
        <TestComponent topics={defaultTopics} />
      </MqttProvider>,
    )
    const task1 = capturedTask

    rerender(
      <MqttProvider httpClient={httpClient}>
        <TestComponent topics={updatedTopics} />
      </MqttProvider>,
    )

    expect(mockUseAsyncTask).toHaveBeenCalledTimes(2)
    const task2 = capturedTask
    expect(task2).not.toBe(task1)

    await act(async () => {
      await task2()
    })

    expect(httpClient.queryJsonBatch).toHaveBeenCalledTimes(1)
    expect(httpClient.queryJsonBatch).toHaveBeenCalledWith(updatedTopics)
  })

  it("should NOT create a new task if topics array reference is stable (memoized)", () => {
    const stableTopics = [...defaultTopics]

    const { rerender } = render(
      <MqttProvider httpClient={httpClient}>
        <TestComponent topics={stableTopics} />
      </MqttProvider>,
    )
    const task1 = capturedTask

    rerender(
      <MqttProvider httpClient={httpClient}>
        <TestComponent topics={stableTopics} />
      </MqttProvider>,
    )

    expect(mockUseAsyncTask).toHaveBeenCalledTimes(2)
    const task2 = capturedTask
    expect(task2).toBe(task1)
  })

  it("should handle absence of httpClient gracefully", async () => {
    render(
      <MqttProvider mqttClient={createMqttClientMock()}>
        <TestComponent topics={defaultTopics} />
      </MqttProvider>,
    )

    expect(mockUseAsyncTask).toHaveBeenCalledTimes(1)
    expect(capturedTask).toBeInstanceOf(Function)

    await act(async () => {
      await expect(capturedTask()).rejects.toThrow(
        "useQueryJsonBatch: HttpClient not available in context.",
      )
    })

    expect(httpClient.queryJsonBatch).not.toHaveBeenCalled()
  })
})
