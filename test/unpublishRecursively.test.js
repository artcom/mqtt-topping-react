/* eslint-disable import/first */
jest.mock("@artcom/mqtt-topping", () => ({ unpublishRecursively: jest.fn() }))

import * as topping from "@artcom/mqtt-topping"
import React, { useContext } from "react"
import { render } from "@testing-library/react"
import { MqttContext, MqttProvider } from "../src"

const topic = "testTopic"

const Component = () => {
  useContext(MqttContext).unpublishRecursively(topic)

  return <></>
}

describe("UnpublishRecursively", () => {
  let mqtt
  let http

  beforeAll(() => {
    mqtt = "mqtt"
    http = "http"
  })

  it("should unpublish a given topic", async () => {
    render(
      <MqttProvider mqtt={ mqtt } http={ http }>
        <Component />
      </MqttProvider>
    )

    expect(topping.unpublishRecursively).toHaveBeenCalledWith("mqtt", "http", "testTopic")
  })
})
