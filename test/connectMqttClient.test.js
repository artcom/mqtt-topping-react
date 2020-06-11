/* eslint-disable import/first */
jest.mock("@artcom/mqtt-topping", () => ({ connectMqttClient: jest.fn() }))

import topping from "@artcom/mqtt-topping"
import { connectMqttClient } from "../src"

describe("connectMqttClient", () => {
  test("calls internal connectMqttClient method", () => {
    connectMqttClient("broker.test.local", "testId")

    expect(topping.connectMqttClient).toHaveBeenCalled()
  })
})
