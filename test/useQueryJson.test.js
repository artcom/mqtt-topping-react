/**
 * @jest-environment jsdom
 */

/* eslint-disable import/first */
jest.mock("@artcom/async-task-hook", () => ({ useAsyncTask: jest.fn() }))

import { useAsyncTask } from "@artcom/async-task-hook"
import React from "react"
import { render } from "@testing-library/react"
import { MqttProvider } from "../src/mqttProvider"
import { useQueryJson } from "../src"
import { createHttpClientMock } from "./utils"

const defaultTopic = "testTopic"

const TestComponent = ({ topic = defaultTopic }) => {
  useQueryJson(topic)
  return <></>
}

describe("useQueryJson", () => {
  let httpClient

  beforeEach(() => {
    useAsyncTask.mockReset()

    httpClient = createHttpClientMock()
  })

  it("should create a query task hook with provided arguments", () => {
    render(
      <MqttProvider httpClient={httpClient}>
        <TestComponent />
      </MqttProvider>,
    )

    expect(useAsyncTask).toHaveBeenCalledTimes(1)
    const task = useAsyncTask.mock.calls[0][0]

    task() // run created task manually

    expect(httpClient.queryJson).toHaveBeenCalledTimes(1)
    expect(httpClient.queryJson.mock.calls[0][0]).toEqual(defaultTopic)
  })

  it("should create a query task hook with changed topic", () => {
    const { rerender } = render(
      <MqttProvider httpClient={httpClient}>
        <TestComponent />
      </MqttProvider>,
    )

    const updatedTopic = "updatedTopic"

    rerender(
      <MqttProvider httpClient={httpClient}>
        <TestComponent topic={updatedTopic} />
      </MqttProvider>,
    )

    expect(useAsyncTask).toHaveBeenCalledTimes(2)
    const task = useAsyncTask.mock.calls[1][0]

    task() // run created task manually

    expect(httpClient.queryJson).toHaveBeenCalledTimes(1)
    expect(httpClient.queryJson.mock.calls[0][0]).toEqual(updatedTopic)
  })

  it("should not create a new query task for same topic", () => {
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
