import React from "react"
import { render } from "@testing-library/react"
import { MqttProvider, useMqttSubscribe } from "../src"

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
  let mqtt

  beforeEach(() => {
    mqtt = {
      subscribe: jest.fn(),
      unsubscribe: jest.fn()
    }
  })

  it("should subscribe to given topic", () => {
    render(
      <MqttProvider mqtt={ mqtt }>
        <TestComponent />
      </MqttProvider>
    )


    expect(mqtt.subscribe).toHaveBeenCalledTimes(1)
    expect(mqtt.subscribe).toHaveBeenCalledWith(defaultTopic, defaultHandler, defaultOptions)
    expect(mqtt.unsubscribe).toHaveBeenCalledTimes(0)
  })

  it("should unsubscribe on unmount", () => {
    const { unmount } = render(
      <MqttProvider mqtt={ mqtt }>
        <TestComponent />
      </MqttProvider>
    )

    unmount(
      <MqttProvider mqtt={ mqtt }>
        <TestComponent />
      </MqttProvider>
    )

    expect(mqtt.subscribe).toHaveBeenCalledTimes(1)
    expect(mqtt.subscribe).toHaveBeenCalledWith(defaultTopic, defaultHandler, defaultOptions)
    expect(mqtt.unsubscribe).toHaveBeenCalledTimes(1)
    expect(mqtt.unsubscribe).toHaveBeenCalledWith(defaultTopic, defaultHandler)
  })

  it("should subscribe only once", () => {
    const { rerender } = render(
      <MqttProvider mqtt={ mqtt }>
        <TestComponent />
      </MqttProvider>
    )

    rerender(
      <MqttProvider mqtt={ mqtt }>
        <TestComponent />
      </MqttProvider>
    )

    rerender(
      <MqttProvider mqtt={ mqtt }>
        <TestComponent />
      </MqttProvider>
    )

    expect(mqtt.subscribe).toHaveBeenCalledTimes(1)
    expect(mqtt.subscribe).toHaveBeenCalledWith(defaultTopic, defaultHandler, defaultOptions)
    expect(mqtt.unsubscribe).toHaveBeenCalledTimes(0)
  })

  it("should update topic", () => {
    const { rerender } = render(
      <MqttProvider mqtt={ mqtt }>
        <TestComponent />
      </MqttProvider>
    )

    const updatedTopic = "updatedTopic"

    rerender(
      <MqttProvider mqtt={ mqtt }>
        <TestComponent topic={ updatedTopic } />
      </MqttProvider>
    )

    expect(mqtt.subscribe).toHaveBeenCalledTimes(2)
    expect(mqtt.subscribe).toHaveBeenNthCalledWith(1, defaultTopic, defaultHandler, defaultOptions)
    expect(mqtt.subscribe).toHaveBeenNthCalledWith(2, updatedTopic, defaultHandler, defaultOptions)
    expect(mqtt.unsubscribe).toHaveBeenCalledTimes(1)
    expect(mqtt.unsubscribe).toHaveBeenCalledWith(defaultTopic, defaultHandler)
  })

  it("should update handler", () => {
    const { rerender } = render(
      <MqttProvider mqtt={ mqtt }>
        <TestComponent />
      </MqttProvider>
    )

    const updatedHandler = () => null

    rerender(
      <MqttProvider mqtt={ mqtt }>
        <TestComponent handler={ updatedHandler } />
      </MqttProvider>
    )

    expect(mqtt.subscribe).toHaveBeenCalledTimes(2)
    expect(mqtt.subscribe).toHaveBeenNthCalledWith(1, defaultTopic, defaultHandler, defaultOptions)
    expect(mqtt.subscribe).toHaveBeenNthCalledWith(2, defaultTopic, updatedHandler, defaultOptions)
    expect(mqtt.unsubscribe).toHaveBeenCalledTimes(1)
    expect(mqtt.unsubscribe).toHaveBeenCalledWith(defaultTopic, defaultHandler)
  })

  it("should update options", () => {
    const { rerender } = render(
      <MqttProvider mqtt={ mqtt }>
        <TestComponent />
      </MqttProvider>
    )

    const updatedOptions = { qos: 0, parseJson: true }

    rerender(
      <MqttProvider mqtt={ mqtt }>
        <TestComponent options={ updatedOptions } />
      </MqttProvider>
    )

    expect(mqtt.subscribe).toHaveBeenCalledTimes(2)
    expect(mqtt.subscribe).toHaveBeenNthCalledWith(1, defaultTopic, defaultHandler, defaultOptions)
    expect(mqtt.subscribe).toHaveBeenNthCalledWith(2, defaultTopic, defaultHandler, updatedOptions)
    expect(mqtt.unsubscribe).toHaveBeenCalledTimes(1)
    expect(mqtt.unsubscribe).toHaveBeenCalledWith(defaultTopic, defaultHandler)
  })
})
