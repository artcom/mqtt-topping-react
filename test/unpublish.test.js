import React, { useContext } from "react"
import { render } from "@testing-library/react"
import { MqttContext, MqttProvider } from "../src/mqttProvider"

const topic = "testTopic"

const TestComponent = () => {
  useContext(MqttContext).unpublish(topic)

  return <>Test Component</>
}

describe("Unpublish", () => {
  let mqtt

  beforeAll(() => {
    mqtt = { unpublish: jest.fn() }
  })

  it("should unpublish a given topic", () => {
    render(
      <MqttProvider mqtt={ mqtt }>
        <TestComponent />
      </MqttProvider>
    )

    expect(mqtt.unpublish).toHaveBeenCalledWith(topic)
  })
})
