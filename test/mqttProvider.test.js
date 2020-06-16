/* eslint-disable import/first */
jest.mock("@artcom/mqtt-topping", () => ({ unpublishRecursively: jest.fn() }))

import * as topping from "@artcom/mqtt-topping"
import React, { useContext } from "react"
import { render } from "@testing-library/react"
import { MqttContext, MqttProvider } from "../src"

const topic = "testTopic"
const payload = "testPayload"
const options = { qos: 2, stringifyJson: true, retain: true }

describe("MqttProvider", () => {
  describe("Publish", () => {
    let mqtt

    beforeAll(() => {
      mqtt = { publish: jest.fn() }
    })

    it("should publish given payload for given topic", () => {
      const PublishComponent = () => {
        useContext(MqttContext).mqtt.publish(topic, payload, options)
        return <></>
      }

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
      const UnpublishComponent = () => {
        useContext(MqttContext).mqtt.unpublish(topic)
        return <></>
      }

      render(
        <MqttProvider mqtt={ mqtt }>
          <UnpublishComponent />
        </MqttProvider>
      )

      expect(mqtt.unpublish).toHaveBeenCalledWith(topic)
    })
  })

  describe("UnpublishRecursively", () => {
    let mqtt
    let http

    beforeAll(() => {
      mqtt = "mqtt"
      http = "http"
    })

    it("should unpublish a given topic", async () => {
      const Component = () => {
        useContext(MqttContext).unpublishRecursively(topic)
        return <></>
      }

      render(
        <MqttProvider mqtt={ mqtt } http={ http }>
          <Component />
        </MqttProvider>
      )

      expect(topping.unpublishRecursively).toHaveBeenCalledWith("mqtt", "http", "testTopic")
    })
  })
})
