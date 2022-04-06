/**
 * @jest-environment jsdom
 */

/* eslint-disable import/first */
jest.mock("@artcom/async-task-hook", () => ({ useAsyncTask: jest.fn() }))

import { useAsyncTask } from "@artcom/async-task-hook"
import { render } from "@testing-library/react"
import { MqttProvider } from "../src/mqttProvider"
import { useQuery } from "../src"
import { createHttpClientMock } from "./utils"

const defaultTopic = "testTopic"
const defaultDepth = 0
const defaultFlatten = false
const defaultParseJson = false

const TestComponent = ({
  topic = defaultTopic,
  depth = defaultDepth,
  flatten = defaultFlatten,
  parseJson = defaultParseJson,
}) => {
  useQuery({ topic, depth, flatten, parseJson })

  return <></>
}

describe("useQuery", () => {
  let httpClient

  beforeEach(() => {
    useAsyncTask.mockReset()

    httpClient = createHttpClientMock()
  })

  it("should create a query task hook with provided arguments", () => {
    render(
      <MqttProvider httpClient={httpClient}>
        <TestComponent />
      </MqttProvider>
    )

    expect(useAsyncTask).toHaveBeenCalledTimes(1)
    const task = useAsyncTask.mock.calls[0][0]

    task() // run created task manually

    expect(httpClient.query).toHaveBeenCalledTimes(1)
    expect(httpClient.query.mock.calls[0][0]).toEqual({
      topic: defaultTopic,
      depth: defaultDepth,
      flatten: defaultFlatten,
      parseJson: defaultParseJson,
    })
  })

  it("should create a query task hook with changed 'topic'", () => {
    const { rerender } = render(
      <MqttProvider httpClient={httpClient}>
        <TestComponent />
      </MqttProvider>
    )

    const updatedTopic = "updatedTopic"

    rerender(
      <MqttProvider httpClient={httpClient}>
        <TestComponent topic={updatedTopic} />
      </MqttProvider>
    )

    expect(useAsyncTask).toHaveBeenCalledTimes(2)
    const task = useAsyncTask.mock.calls[1][0]

    task() // run created task manually

    expect(httpClient.query).toHaveBeenCalledTimes(1)
    expect(httpClient.query.mock.calls[0][0]).toEqual({
      topic: updatedTopic,
      depth: defaultDepth,
      flatten: defaultFlatten,
      parseJson: defaultParseJson,
    })
  })

  it("should create a query task hook with changed 'depth'", () => {
    const { rerender } = render(
      <MqttProvider httpClient={httpClient}>
        <TestComponent />
      </MqttProvider>
    )

    const updatedDepth = 1

    rerender(
      <MqttProvider httpClient={httpClient}>
        <TestComponent depth={updatedDepth} />
      </MqttProvider>
    )

    expect(useAsyncTask).toHaveBeenCalledTimes(2)
    const task = useAsyncTask.mock.calls[1][0]

    task() // run created task manually

    expect(httpClient.query).toHaveBeenCalledTimes(1)
    expect(httpClient.query.mock.calls[0][0]).toEqual({
      topic: defaultTopic,
      depth: updatedDepth,
      flatten: defaultFlatten,
      parseJson: defaultParseJson,
    })
  })

  it("should create a query task hook with changed 'flatten'", () => {
    const { rerender } = render(
      <MqttProvider httpClient={httpClient}>
        <TestComponent />
      </MqttProvider>
    )

    const updatedFlatten = true

    rerender(
      <MqttProvider httpClient={httpClient}>
        <TestComponent flatten={updatedFlatten} />
      </MqttProvider>
    )

    expect(useAsyncTask).toHaveBeenCalledTimes(2)
    const task = useAsyncTask.mock.calls[1][0]

    task() // run created task manually

    expect(httpClient.query).toHaveBeenCalledTimes(1)
    expect(httpClient.query.mock.calls[0][0]).toEqual({
      topic: defaultTopic,
      depth: defaultDepth,
      flatten: updatedFlatten,
      parseJson: defaultParseJson,
    })
  })

  it("should create a query task hook with changed 'parseJson'", () => {
    const { rerender } = render(
      <MqttProvider httpClient={httpClient}>
        <TestComponent />
      </MqttProvider>
    )

    const updatedParseJson = true

    rerender(
      <MqttProvider httpClient={httpClient}>
        <TestComponent parseJson={updatedParseJson} />
      </MqttProvider>
    )

    expect(useAsyncTask).toHaveBeenCalledTimes(2)
    const task = useAsyncTask.mock.calls[1][0]

    task() // run created task manually

    expect(httpClient.query).toHaveBeenCalledTimes(1)
    expect(httpClient.query.mock.calls[0][0]).toEqual({
      topic: defaultTopic,
      depth: defaultDepth,
      flatten: defaultFlatten,
      parseJson: updatedParseJson,
    })
  })

  it("should not create a new query task for equal query arguments", () => {
    const { rerender } = render(
      <MqttProvider httpClient={httpClient}>
        <TestComponent />
      </MqttProvider>
    )

    rerender(
      <MqttProvider httpClient={httpClient}>
        <TestComponent />
      </MqttProvider>
    )

    expect(useAsyncTask).toHaveBeenCalledTimes(2)
    const task1 = useAsyncTask.mock.calls[0][0]
    const task2 = useAsyncTask.mock.calls[1][0]

    expect(task1).toBe(task2)
  })
})
