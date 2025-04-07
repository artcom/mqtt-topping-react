import React, { FC, useContext } from "react"
import { render } from "@testing-library/react"
import { MqttContext, MqttProvider } from "../src"
import { createMqttClientMock, createHttpClientMock, MockMqttClient, MockHttpClient } from "./utils"
import type { MqttPublishOptions } from "@artcom/mqtt-topping"

const topic = "testTopic"
const payload = "testPayload"
const options: MqttPublishOptions = { qos: 1, retain: true, parseType: "json" }

describe("MqttProvider", () => {
  let mqttClient: MockMqttClient
  let httpClient: MockHttpClient

  beforeEach(() => {
    mqttClient = createMqttClientMock()
    httpClient = createHttpClientMock()
  })

  describe("Publish", () => {
    it("should bind and call mqttClient.publish via context", () => {
      const PublishComponent: FC = () => {
        useContext(MqttContext).publish(topic, payload, options)
        return null
      }

      render(
        <MqttProvider mqttClient={mqttClient}>
          <PublishComponent />
        </MqttProvider>,
      )

      expect(mqttClient.publish).toHaveBeenCalledTimes(1)
      expect(mqttClient.publish).toHaveBeenCalledWith(topic, payload, options)
    })

    it("should not fail if mqttClient is not provided", () => {
      const PublishComponent: FC = () => {
        const { publish } = useContext(MqttContext)
        publish(topic, payload, options).catch((err) => {
          console.log("Caught expected error:", err.message)
        })
        return null
      }

      expect(() => {
        render(
          <MqttProvider httpClient={httpClient}>
            <PublishComponent />
          </MqttProvider>,
        )
      }).not.toThrow()

      expect(mqttClient.publish).not.toHaveBeenCalled()
    })
  })

  describe("Unpublish", () => {
    it("should bind and call mqttClient.unpublish via context", () => {
      const UnpublishComponent: FC = () => {
        useContext(MqttContext).unpublish(topic)
        return null
      }

      render(
        <MqttProvider mqttClient={mqttClient}>
          <UnpublishComponent />
        </MqttProvider>,
      )

      expect(mqttClient.unpublish).toHaveBeenCalledTimes(1)
      expect(mqttClient.unpublish).toHaveBeenCalledWith(topic)
    })
  })

  describe("Query Methods", () => {
    it("should bind and call httpClient.queryJson via context", () => {
      const QueryComponent: FC = () => {
        useContext(MqttContext).queryJson(topic)
        return null
      }

      render(
        <MqttProvider httpClient={httpClient}>
          <QueryComponent />
        </MqttProvider>,
      )

      expect(httpClient.queryJson).toHaveBeenCalledTimes(1)
      expect(httpClient.queryJson).toHaveBeenCalledWith(topic)
    })

    it("should not fail if httpClient is not provided", () => {
      const QueryComponent: FC = () => {
        const { query } = useContext(MqttContext)
        query({ topic }).catch((err) => {})
        return null
      }

      expect(() => {
        render(
          <MqttProvider mqttClient={mqttClient}>
            <QueryComponent />
          </MqttProvider>,
        )
      }).not.toThrow()
      expect(httpClient.query).not.toHaveBeenCalled()
    })
  })
})
