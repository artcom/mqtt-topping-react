import React from "react"
import { render } from "@testing-library/react"
import { MqttProvider } from "../src/mqttProvider"
import useMqttPublish from "../src/useMqttPublish"

const defaultTopic = "testTopic"
const defaultPayload = "testPayload"
const defaultOptions = { qos: 2, stringifyJson: true, retain: true }

let publishFn

const TestComponent = ({
  topic = defaultTopic,
  payload = defaultPayload,
  options = defaultOptions }) => {
  publishFn = useMqttPublish(topic, options)
  publishFn(payload)

  return <>Test Component</>
}

describe("useMqttPublish", () => {
  let mqtt

  beforeAll(() => {
    mqtt = {
      subscribe: jest.fn(),
      publish: jest.fn()
    }

    publishFn = null
  })

  it("should publish given payload for given topic", () => {
    render(
      <MqttProvider mqtt={ mqtt }>
        <TestComponent />
      </MqttProvider>
    )

    expect(mqtt.publish).toHaveBeenCalledWith(defaultTopic, defaultPayload, defaultOptions)
  })

  it("should handle topic update with callback update", () => {
    const { rerender } = render(
      <MqttProvider mqtt={ mqtt }>
        <TestComponent />
      </MqttProvider>
    )

    const firstPublishFn = publishFn
    expect(mqtt.publish).toHaveBeenCalledWith(defaultTopic, defaultPayload, defaultOptions)

    const updatedTopic = "updatedTestTopic"
    rerender(
      <MqttProvider mqtt={ mqtt }>
        <TestComponent topic={ updatedTopic } />
      </MqttProvider>
    )

    const secondPublishFn = publishFn
    expect(mqtt.publish).toHaveBeenCalledWith(updatedTopic, defaultPayload, defaultOptions)
    expect(firstPublishFn).not.toBe(secondPublishFn)
  })

  it("should handle options update with callback update", () => {
    const { rerender } = render(
      <MqttProvider mqtt={ mqtt }>
        <TestComponent />
      </MqttProvider>
    )

    const firstPublishFn = publishFn
    expect(mqtt.publish).toHaveBeenCalledWith(defaultTopic, defaultPayload, defaultOptions)

    const updatedOptions = { qos: 0, stringifyJson: true, retain: true }
    rerender(
      <MqttProvider mqtt={ mqtt }>
        <TestComponent options={ updatedOptions } />
      </MqttProvider>
    )

    const secondPublishFn = publishFn
    expect(mqtt.publish).toHaveBeenCalledWith(defaultTopic, defaultPayload, updatedOptions)
    expect(firstPublishFn).not.toBe(secondPublishFn)
  })

  it("should handle payload update without callback update", () => {
    const { rerender } = render(
      <MqttProvider mqtt={ mqtt }>
        <TestComponent />
      </MqttProvider>
    )

    const firstPublishFn = publishFn
    expect(mqtt.publish).toHaveBeenCalledWith(defaultTopic, defaultPayload, defaultOptions)

    const updatedPayload = "testPayload2"
    rerender(
      <MqttProvider mqtt={ mqtt }>
        <TestComponent payload={ updatedPayload } />
      </MqttProvider>
    )

    const secondPublishFn = publishFn
    expect(mqtt.publish).toHaveBeenCalledWith(defaultTopic, updatedPayload, defaultOptions)
    expect(firstPublishFn).toBe(secondPublishFn)
  })

  it("should reuse callback", () => {
    const { rerender } = render(
      <MqttProvider mqtt={ mqtt }>
        <TestComponent />
      </MqttProvider>
    )

    const firstPublishFn = publishFn

    rerender(
      <MqttProvider mqtt={ mqtt }>
        <TestComponent />
      </MqttProvider>
    )

    const secondPublishFn = publishFn

    expect(firstPublishFn).toBe(secondPublishFn)
  })
})
