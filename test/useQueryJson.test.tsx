

import React, { FC } from "react" 
import { useAsyncTask, AsyncTask } from "@artcom/async-task-hook"
import { render, act, rerender as rtlRerender } from "@testing-library/react"
import { MqttProvider } from "../src/mqttProvider"
import { useQueryJson } from "../src" 
import { createHttpClientMock, createMqttClientMock, MockHttpClient } from "./utils"
import type { HttpJsonResult, HttpError } from "@artcom/mqtt-topping" 


const mockUseAsyncTask = useAsyncTask as jest.Mock
jest.mock("@artcom/async-task-hook", () => ({
  useAsyncTask: jest.fn(),
  
}))

const defaultTopic = "testTopic"


interface TestComponentProps {
  topic?: string
}

const TestComponent: FC<TestComponentProps> = ({ topic = defaultTopic }) => {
  useQueryJson(topic)
  return null
}

describe("useQueryJson", () => {
  let httpClient: MockHttpClient
  let capturedTask: () => Promise<HttpJsonResult>

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

  it("should pass the correct topic to httpClient.queryJson when task runs", async () => {
    render(
      <MqttProvider httpClient={httpClient}>
        <TestComponent topic={defaultTopic} />
      </MqttProvider>,
    )

    expect(mockUseAsyncTask).toHaveBeenCalledTimes(1)
    expect(capturedTask).toBeInstanceOf(Function)

    await act(async () => {
      await capturedTask()
    })

    expect(httpClient.queryJson).toHaveBeenCalledTimes(1)
    expect(httpClient.queryJson).toHaveBeenCalledWith(defaultTopic)
  })

  it("should create a new task with updated topic on rerender", async () => {
    const { rerender } = render(
      <MqttProvider httpClient={httpClient}>
        <TestComponent topic={defaultTopic} />
      </MqttProvider>,
    )
    const task1 = capturedTask

    const updatedTopic = "updatedTopic"

    rerender(
      <MqttProvider httpClient={httpClient}>
        <TestComponent topic={updatedTopic} />
      </MqttProvider>,
    )

    expect(mockUseAsyncTask).toHaveBeenCalledTimes(2)
    const task2 = capturedTask
    expect(task2).not.toBe(task1)

    await act(async () => {
      await task2()
    })

    expect(httpClient.queryJson).toHaveBeenCalledTimes(1)
    expect(httpClient.queryJson).toHaveBeenCalledWith(updatedTopic)
  })

  it("should NOT create a new task if topic is identical", () => {
    const { rerender } = render(
      <MqttProvider httpClient={httpClient}>
        <TestComponent topic={defaultTopic} />
      </MqttProvider>,
    )
    const task1 = capturedTask

    rerender(
      <MqttProvider httpClient={httpClient}>
        <TestComponent topic={defaultTopic} />
      </MqttProvider>,
    )

    expect(mockUseAsyncTask).toHaveBeenCalledTimes(2)
    const task2 = capturedTask
    expect(task2).toBe(task1)
  })

  it("should handle absence of httpClient gracefully", async () => {
    render(
      <MqttProvider mqttClient={createMqttClientMock()}>
        <TestComponent topic={defaultTopic} />
      </MqttProvider>,
    )

    expect(mockUseAsyncTask).toHaveBeenCalledTimes(1)
    expect(capturedTask).toBeInstanceOf(Function)

    await act(async () => {
      await expect(capturedTask()).rejects.toThrow(
        "useQueryJson: HttpClient not available in context.",
      )
    })

    expect(httpClient.queryJson).not.toHaveBeenCalled()
  })
})
