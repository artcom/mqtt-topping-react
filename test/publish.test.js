import React, { useContext } from "react"
import { render } from "@testing-library/react"
import { MqttContext, MqttProvider } from "../src/mqttProvider"

const topic = "testTopic"
const payload = "testPayload"
const options = { qos: 2, stringifyJson: true, retain: true }

const TestComponent = () => {
  useContext(MqttContext).publish(topic, payload, options)

  return <>Test Component</>
}

describe("Publish", () => {
  let mqtt

  beforeAll(() => {
    mqtt = { publish: jest.fn() }
  })

  it("should publish given payload for given topic", () => {
    render(
      <MqttProvider mqtt={ mqtt }>
        <TestComponent />
      </MqttProvider>
    )

    expect(mqtt.publish).toHaveBeenCalledWith(topic, payload, options)
  })
})
