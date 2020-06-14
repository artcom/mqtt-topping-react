/* eslint-disable import/first */
jest.mock("@artcom/async-task-hook", () => ({ useAsyncTask: jest.fn() }))

import { useAsyncTask } from "@artcom/async-task-hook"
import React from "react"
import { render } from "@testing-library/react"
import { MqttProvider } from "../src/mqttProvider"
import { useQueryJson } from "../src"

const defaultTopic = "testTopic"

const TestComponent = ({ topic = defaultTopic }) => {
  useQueryJson(topic)
  return <></>
}

describe("useQueryJson", () => {
  let http

  beforeEach(() => {
    useAsyncTask.mockReset()

    http = {
      queryJson: jest.fn()
    }
  })

  it("should create a query task hook with provided arguments", () => {
    render(
      <MqttProvider http={ http }>
        <TestComponent />
      </MqttProvider>
    )


    expect(useAsyncTask).toHaveBeenCalledTimes(1)
    const task = useAsyncTask.mock.calls[0][0]

    task() // run created task manually

    expect(http.queryJson).toHaveBeenCalledTimes(1)
    expect(http.queryJson.mock.calls[0][0]).toEqual(defaultTopic)
  })

  it("should create a query task hook with changed topic", () => {
    const { rerender } = render(
      <MqttProvider http={ http }>
        <TestComponent />
      </MqttProvider>
    )

    rerender(
      <MqttProvider http={ http }>
        <TestComponent topic={ "changedTopic" } />
      </MqttProvider>
    )

    expect(useAsyncTask).toHaveBeenCalledTimes(2)
    const task = useAsyncTask.mock.calls[1][0]

    task() // run created task manually

    expect(http.queryJson).toHaveBeenCalledTimes(1)
    expect(http.queryJson.mock.calls[0][0]).toEqual("changedTopic")
  })

  it("should not create a new query task for same topic", () => {
    const { rerender } = render(
      <MqttProvider http={ http }>
        <TestComponent />
      </MqttProvider>
    )

    rerender(
      <MqttProvider http={ http }>
        <TestComponent />
      </MqttProvider>
    )

    expect(useAsyncTask).toHaveBeenCalledTimes(2)
    const task1 = useAsyncTask.mock.calls[0][0]
    const task2 = useAsyncTask.mock.calls[1][0]

    expect(task1).toBe(task2)
  })
})
