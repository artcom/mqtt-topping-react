/* eslint-disable import/first */
jest.mock("@artcom/mqtt-topping", () => ({ unpublishRecursively: jest.fn() }))

import * as topping from "@artcom/mqtt-topping"
import React, { useContext } from "react"
import { render } from "@testing-library/react"
import { MqttContext, MqttProvider } from "../src"
import { createMqttClientMock, createHttpClientMock } from "./utils"

const topic = "testTopic"
const payload = "testPayload"
const options = { qos: 2, stringifyJson: true, retain: true }

describe("MqttProvider", () => {
  let mqttClient
  let httpClient

  beforeEach(() => {
    mqttClient = createMqttClientMock()
    httpClient = createHttpClientMock()
  })

  describe("Publish", () => {
    it("should publish given payload for given topic", () => {
      const PublishComponent = () => {
        useContext(MqttContext).publish(topic, payload, options)
        return <></>
      }

      render(
        <MqttProvider mqttClient={ mqttClient }>
          <PublishComponent />
        </MqttProvider>
      )

      expect(mqttClient.publish).toHaveBeenCalledWith(topic, payload, options)
    })
  })

  describe("Unpublish", () => {
    it("should unpublish a given topic", () => {
      const UnpublishComponent = () => {
        useContext(MqttContext).unpublish(topic)
        return <></>
      }

      render(
        <MqttProvider mqttClient={ mqttClient }>
          <UnpublishComponent />
        </MqttProvider>
      )

      expect(mqttClient.unpublish).toHaveBeenCalledWith(topic)
    })
  })

  describe("UnpublishRecursively", () => {
    it("should unpublish a given topic", async () => {
      const Component = () => {
        useContext(MqttContext).unpublishRecursively(topic)
        return <></>
      }

      render(
        <MqttProvider mqttClient={ mqttClient } httpClient={ httpClient }>
          <Component />
        </MqttProvider>
      )

      expect(topping.unpublishRecursively).toHaveBeenCalledWith(mqttClient, httpClient, "testTopic")
    })
  })
})
