/* eslint-disable import/first */
jest.mock("@artcom/async-task-hook", () => ({ useAsyncTask: jest.fn() }))

import { useAsyncTask } from "@artcom/async-task-hook"
import React from "react"
import { render } from "@testing-library/react"
import { MqttProvider } from "../src/mqttProvider"
import { useQuery } from "../src"

const defaultTopic = "testTopic"
const defaultDepth = 0
const defaultFlatten = false
const defaultParseJson = false

const TestComponent = ({
  topic = defaultTopic,
  depth = defaultDepth,
  flatten = defaultFlatten,
  parseJson = defaultParseJson }) => {
  useQuery({ topic, depth, flatten, parseJson })

  return <></>
}

describe("useQuery", () => {
  let http

  beforeEach(() => {
    useAsyncTask.mockReset()

    http = {
      query: jest.fn()
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

    expect(http.query).toHaveBeenCalledTimes(1)
    expect(http.query.mock.calls[0][0]).toEqual({
      topic: defaultTopic,
      depth: defaultDepth,
      flatten: defaultFlatten,
      parseJson: defaultParseJson
    })
  })

  it("should create a query task hook with changed 'topic'", () => {
    const { rerender } = render(
      <MqttProvider http={ http }>
        <TestComponent />
      </MqttProvider>
    )

    const updatedTopic = "updatedTopic"

    rerender(
      <MqttProvider http={ http }>
        <TestComponent topic={ updatedTopic } />
      </MqttProvider>
    )

    expect(useAsyncTask).toHaveBeenCalledTimes(2)
    const task = useAsyncTask.mock.calls[1][0]

    task() // run created task manually

    expect(http.query).toHaveBeenCalledTimes(1)
    expect(http.query.mock.calls[0][0]).toEqual({
      topic: updatedTopic,
      depth: defaultDepth,
      flatten: defaultFlatten,
      parseJson: defaultParseJson
    })
  })

  it("should create a query task hook with changed 'depth'", () => {
    const { rerender } = render(
      <MqttProvider http={ http }>
        <TestComponent />
      </MqttProvider>
    )

    const updatedDepth = 1

    rerender(
      <MqttProvider http={ http }>
        <TestComponent depth={ updatedDepth } />
      </MqttProvider>
    )

    expect(useAsyncTask).toHaveBeenCalledTimes(2)
    const task = useAsyncTask.mock.calls[1][0]

    task() // run created task manually

    expect(http.query).toHaveBeenCalledTimes(1)
    expect(http.query.mock.calls[0][0]).toEqual({
      topic: defaultTopic,
      depth: updatedDepth,
      flatten: defaultFlatten,
      parseJson: defaultParseJson
    })
  })

  it("should create a query task hook with changed 'flatten'", () => {
    const { rerender } = render(
      <MqttProvider http={ http }>
        <TestComponent />
      </MqttProvider>
    )

    const updatedFlatten = true

    rerender(
      <MqttProvider http={ http }>
        <TestComponent flatten={ updatedFlatten } />
      </MqttProvider>
    )

    expect(useAsyncTask).toHaveBeenCalledTimes(2)
    const task = useAsyncTask.mock.calls[1][0]

    task() // run created task manually

    expect(http.query).toHaveBeenCalledTimes(1)
    expect(http.query.mock.calls[0][0]).toEqual({
      topic: defaultTopic,
      depth: defaultDepth,
      flatten: updatedFlatten,
      parseJson: defaultParseJson
    })
  })

  it("should create a query task hook with changed 'parseJson'", () => {
    const { rerender } = render(
      <MqttProvider http={ http }>
        <TestComponent />
      </MqttProvider>
    )

    const updatedParseJson = true

    rerender(
      <MqttProvider http={ http }>
        <TestComponent parseJson={ updatedParseJson } />
      </MqttProvider>
    )

    expect(useAsyncTask).toHaveBeenCalledTimes(2)
    const task = useAsyncTask.mock.calls[1][0]

    task() // run created task manually

    expect(http.query).toHaveBeenCalledTimes(1)
    expect(http.query.mock.calls[0][0]).toEqual({
      topic: defaultTopic,
      depth: defaultDepth,
      flatten: defaultFlatten,
      parseJson: updatedParseJson
    })
  })

  it("should not create a new query task for equal query arguments", () => {
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
