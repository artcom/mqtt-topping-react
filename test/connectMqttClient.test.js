/* eslint-disable import/first */
jest.mock("@artcom/mqtt-topping", () => ({
  connectMqttClient: jest.fn().mockResolvedValue("mqtt")
}))

import topping from "@artcom/mqtt-topping"
import { connectMqttClient } from "../src"

describe("connectMqttClient", () => {
  test("calls internal connectMqttClient method", async () => {
    const brokerUri = "broker.test.local"
    const appId = "testId"

    const mqttClient = await connectMqttClient(brokerUri, appId)

    expect(topping.connectMqttClient).toHaveBeenCalledWith(brokerUri, expect.anything())
    expect(mqttClient).toBe("mqtt")
  })
})
