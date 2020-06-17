/* eslint-disable import/first */
jest.mock("@artcom/async-task-hook", () => ({ useAsyncTask: jest.fn() }))

import { useAsyncTask } from "@artcom/async-task-hook"
import React from "react"
import { render } from "@testing-library/react"
import { MqttProvider } from "../src/mqttProvider"
import { useQueryBatch } from "../src"
import { createHttpClientMock } from "./utils"

const query1 = { topic: "testTopic", depth: 0, flatten: false, parseJson: false }
const query2 = { topic: "testTopic2", depth: 0, flatten: false, parseJson: false }
const query3 = { topic: "testTopic3", depth: 0, flatten: false, parseJson: false }

const defaultQueries = [query1, query2]

const TestComponent = ({ queries = defaultQueries }) => {
  useQueryBatch(queries)
  return <></>
}

describe("useQueryBatch", () => {
  let httpClient

  beforeEach(() => {
    useAsyncTask.mockReset()

    httpClient = createHttpClientMock()
  })

  it("should create a queryBatch task hook with provided arguments", () => {
    render(
      <MqttProvider httpClient={ httpClient }>
        <TestComponent />
      </MqttProvider>
    )


    expect(useAsyncTask).toHaveBeenCalledTimes(1)
    const task = useAsyncTask.mock.calls[0][0]

    task() // run created task manually

    expect(httpClient.queryBatch).toHaveBeenCalledTimes(1)
    expect(httpClient.queryBatch.mock.calls[0][0]).toEqual([query1, query2])
  })

  it("should create a query batch task hook with changed queries", () => {
    const { rerender } = render(
      <MqttProvider httpClient={ httpClient }>
        <TestComponent />
      </MqttProvider>
    )

    rerender(
      <MqttProvider httpClient={ httpClient }>
        <TestComponent queries={ [query1, query2, query3] } />
      </MqttProvider>
    )

    expect(useAsyncTask).toHaveBeenCalledTimes(2)
    const task = useAsyncTask.mock.calls[1][0]

    task() // run created task manually

    expect(httpClient.queryBatch).toHaveBeenCalledTimes(1)
    expect(httpClient.queryBatch.mock.calls[0][0]).toEqual([query1, query2, query3])
  })

  it("should not create a new query task for same queries", () => {
    const { rerender } = render(
      <MqttProvider httpClient={ httpClient }>
        <TestComponent />
      </MqttProvider>
    )

    rerender(
      <MqttProvider httpClient={ httpClient }>
        <TestComponent />
      </MqttProvider>
    )

    expect(useAsyncTask).toHaveBeenCalledTimes(2)
    const task1 = useAsyncTask.mock.calls[0][0]
    const task2 = useAsyncTask.mock.calls[1][0]

    expect(task1).toBe(task2)
  })
})
