/**
 * @jest-environment jsdom
 */

import React from "react"
import { render } from "@testing-library/react"
import { MqttProvider, useMqttSubscribe } from "../src"
import { createMqttClientMock } from "./utils"

const defaultTopic = "testTopic"
const defaultHandler = () => {}
const defaultOptions = { qos: 2, parseJson: true }

const TestComponent = ({
  topic = defaultTopic,
  handler = defaultHandler,
  options = defaultOptions }) => {
  useMqttSubscribe(topic, handler, options)

  return <></>
}

describe("useMqttSubscribe", () => {
  let mqttClient

  beforeEach(() => {
    mqttClient = createMqttClientMock()
  })

  it("should subscribe to given topic", () => {
    render(
      <MqttProvider mqttClient={ mqttClient }>
        <TestComponent />
      </MqttProvider>
    )


    expect(mqttClient.subscribe).toHaveBeenCalledTimes(1)
    expect(mqttClient.subscribe).toHaveBeenCalledWith(defaultTopic, defaultHandler, defaultOptions)
    expect(mqttClient.unsubscribe).toHaveBeenCalledTimes(0)
  })

  it("should unsubscribe on unmount", () => {
    const { unmount } = render(
      <MqttProvider mqttClient={ mqttClient }>
        <TestComponent />
      </MqttProvider>
    )

    unmount(
      <MqttProvider mqttClient={ mqttClient }>
        <TestComponent />
      </MqttProvider>
    )

    expect(mqttClient.subscribe).toHaveBeenCalledTimes(1)
    expect(mqttClient.subscribe).toHaveBeenCalledWith(defaultTopic, defaultHandler, defaultOptions)
    expect(mqttClient.unsubscribe).toHaveBeenCalledTimes(1)
    expect(mqttClient.unsubscribe).toHaveBeenCalledWith(defaultTopic, defaultHandler)
  })

  it("should subscribe only once", () => {
    const { rerender } = render(
      <MqttProvider mqttClient={ mqttClient }>
        <TestComponent />
      </MqttProvider>
    )

    rerender(
      <MqttProvider mqttClient={ mqttClient }>
        <TestComponent />
      </MqttProvider>
    )

    rerender(
      <MqttProvider mqttClient={ mqttClient }>
        <TestComponent />
      </MqttProvider>
    )

    expect(mqttClient.subscribe).toHaveBeenCalledTimes(1)
    expect(mqttClient.subscribe).toHaveBeenCalledWith(defaultTopic, defaultHandler, defaultOptions)
    expect(mqttClient.unsubscribe).toHaveBeenCalledTimes(0)
  })

  it("should update topic", () => {
    const { rerender } = render(
      <MqttProvider mqttClient={ mqttClient }>
        <TestComponent />
      </MqttProvider>
    )

    const updatedTopic = "updatedTopic"

    rerender(
      <MqttProvider mqttClient={ mqttClient }>
        <TestComponent topic={ updatedTopic } />
      </MqttProvider>
    )

    expect(mqttClient.subscribe).toHaveBeenCalledTimes(2)
    expect(mqttClient.subscribe).toHaveBeenNthCalledWith(
      1, defaultTopic, defaultHandler, defaultOptions
    )
    expect(mqttClient.subscribe).toHaveBeenNthCalledWith(
      2, updatedTopic, defaultHandler, defaultOptions
    )
    expect(mqttClient.unsubscribe).toHaveBeenCalledTimes(1)
    expect(mqttClient.unsubscribe).toHaveBeenCalledWith(defaultTopic, defaultHandler)
  })

  it("should update handler", () => {
    const { rerender } = render(
      <MqttProvider mqttClient={ mqttClient }>
        <TestComponent />
      </MqttProvider>
    )

    const updatedHandler = () => null

    rerender(
      <MqttProvider mqttClient={ mqttClient }>
        <TestComponent handler={ updatedHandler } />
      </MqttProvider>
    )

    expect(mqttClient.subscribe).toHaveBeenCalledTimes(2)
    expect(mqttClient.subscribe).toHaveBeenNthCalledWith(
      1, defaultTopic, defaultHandler, defaultOptions
    )
    expect(mqttClient.subscribe).toHaveBeenNthCalledWith(
      2, defaultTopic, updatedHandler, defaultOptions
    )
    expect(mqttClient.unsubscribe).toHaveBeenCalledTimes(1)
    expect(mqttClient.unsubscribe).toHaveBeenCalledWith(defaultTopic, defaultHandler)
  })

  it("should update options", () => {
    const { rerender } = render(
      <MqttProvider mqttClient={ mqttClient }>
        <TestComponent />
      </MqttProvider>
    )

    const updatedOptions = { qos: 0, parseJson: true }

    rerender(
      <MqttProvider mqttClient={ mqttClient }>
        <TestComponent options={ updatedOptions } />
      </MqttProvider>
    )

    expect(mqttClient.subscribe).toHaveBeenCalledTimes(2)
    expect(mqttClient.subscribe).toHaveBeenNthCalledWith(
      1, defaultTopic, defaultHandler, defaultOptions
    )
    expect(mqttClient.subscribe).toHaveBeenNthCalledWith(
      2, defaultTopic, defaultHandler, updatedOptions
    )
    expect(mqttClient.unsubscribe).toHaveBeenCalledTimes(1)
    expect(mqttClient.unsubscribe).toHaveBeenCalledWith(defaultTopic, defaultHandler)
  })
})
