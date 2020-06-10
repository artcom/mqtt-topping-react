/* eslint-disable import/first */
jest.mock("@artcom/mqtt-topping", () => ({ connectMqttClient: jest.fn() }))

import topping from "@artcom/mqtt-topping"
import { connect } from "../src"

describe("connect", () => {
  test("calls internal connect method", () => {
    connect("broker.test.local", "testId")

    expect(topping.connectMqttClient).toHaveBeenCalled()
  })
})
