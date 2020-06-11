import React, { useContext } from "react"
import { render } from "@testing-library/react"
import { MqttContext, MqttProvider } from "../src/mqttProvider"

const topic = "testTopic"
const payload = "testPayload"
const options = { qos: 2, stringifyJson: true, retain: true }

const PublishComponent = () => {
  useContext(MqttContext).mqtt.publish(topic, payload, options)
  return <></>
}

const UnpublishComponent = () => {
  useContext(MqttContext).mqtt.unpublish(topic)
  return <></>
}

describe("MQTT", () => {
  describe("Publish", () => {
    let mqtt

    beforeAll(() => {
      mqtt = { publish: jest.fn() }
    })

    it("should publish given payload for given topic", () => {
      render(
        <MqttProvider mqtt={ mqtt }>
          <PublishComponent />
        </MqttProvider>
      )

      expect(mqtt.publish).toHaveBeenCalledWith(topic, payload, options)
    })
  })

  describe("Unpublish", () => {
    let mqtt

    beforeAll(() => {
      mqtt = { unpublish: jest.fn() }
    })

    it("should unpublish a given topic", () => {
      render(
        <MqttProvider mqtt={ mqtt }>
          <UnpublishComponent />
        </MqttProvider>
      )

      expect(mqtt.unpublish).toHaveBeenCalledWith(topic)
    })
  })
})
