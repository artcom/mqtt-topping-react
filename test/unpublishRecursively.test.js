import React, { useContext } from "react"
import { render } from "@testing-library/react"
import { MqttContext, MqttProvider } from "../src/mqttProvider"

const topic = "testTopic"
const subTopic1 = "testTopic/subTopic1"
const subTopic2 = "testTopic/subTopic2"

const Component = () => {
  useContext(MqttContext).unpublishRecursively(topic)

  return <></>
}

describe("UnpublishRecursively", () => {
  let mqtt
  let http

  beforeAll(() => {
    mqtt = { unpublish: jest.fn() }
    http = { query: jest.fn().mockResolvedValue([
      { topic },
      { topic: subTopic1, payload: "foo" },
      { topic: subTopic2, payload: "bar" }
    ]) }
  })

  it("should unpublish a given topic", async () => {
    render(
      <MqttProvider mqtt={ mqtt } http={ http }>
        <Component />
      </MqttProvider>
    )

    await new Promise(resolve => setTimeout(resolve, 100)) // give the unpublish method some time

    expect(http.query).toHaveBeenCalledWith({ topic, depth: -1, flatten: true, parseJson: false })
    expect(mqtt.unpublish).toHaveBeenNthCalledWith(1, subTopic1)
    expect(mqtt.unpublish).toHaveBeenNthCalledWith(2, subTopic2)
  })
})
