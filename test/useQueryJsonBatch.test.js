/**
 * @jest-environment jsdom
 */

/* eslint-disable import/first */
jest.mock("@artcom/async-task-hook", () => ({ useAsyncTask: jest.fn() }))

import { useAsyncTask } from "@artcom/async-task-hook"
import React from "react"
import { render } from "@testing-library/react"
import { MqttProvider } from "../src/mqttProvider"
import { useQueryJsonBatch } from "../src"
import { createHttpClientMock } from "./utils"

const defaultTopics = ["testTopic1", "testTopic2"]

const TestComponent = ({ topics = defaultTopics }) => {
  useQueryJsonBatch(topics)
  return <></>
}

describe("useQueryJsonBatch", () => {
  let httpClient

  beforeEach(() => {
    useAsyncTask.mockReset()

    httpClient = createHttpClientMock()
  })

  it("should create a queryJsonBatch task hook with provided arguments", () => {
    render(
      <MqttProvider httpClient={httpClient}>
        <TestComponent />
      </MqttProvider>,
    )

    expect(useAsyncTask).toHaveBeenCalledTimes(1)
    const task = useAsyncTask.mock.calls[0][0]

    task() // run created task manually

    expect(httpClient.queryJsonBatch).toHaveBeenCalledTimes(1)
    expect(httpClient.queryJsonBatch.mock.calls[0][0]).toEqual(defaultTopics)
  })

  it("should create a query batch task hook with changed queries", () => {
    const { rerender } = render(
      <MqttProvider httpClient={httpClient}>
        <TestComponent />
      </MqttProvider>,
    )

    const updatedTopics = ["testTopic1", "testTopic2", "testTopic3"]

    rerender(
      <MqttProvider httpClient={httpClient}>
        <TestComponent topics={updatedTopics} />
      </MqttProvider>,
    )

    expect(useAsyncTask).toHaveBeenCalledTimes(2)
    const task = useAsyncTask.mock.calls[1][0]

    task() // run created task manually

    expect(httpClient.queryJsonBatch).toHaveBeenCalledTimes(1)
    expect(httpClient.queryJsonBatch.mock.calls[0][0]).toEqual(updatedTopics)
  })

  it("should not create a new query task for same queries", () => {
    const { rerender } = render(
      <MqttProvider httpClient={httpClient}>
        <TestComponent />
      </MqttProvider>,
    )

    rerender(
      <MqttProvider httpClient={httpClient}>
        <TestComponent />
      </MqttProvider>,
    )

    expect(useAsyncTask).toHaveBeenCalledTimes(2)
    const task1 = useAsyncTask.mock.calls[0][0]
    const task2 = useAsyncTask.mock.calls[1][0]

    expect(task1).toBe(task2)
  })
})
