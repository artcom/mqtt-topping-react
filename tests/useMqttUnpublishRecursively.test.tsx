import { HttpClient, MqttClient } from "@artcom/mqtt-topping"
import { renderHook } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { useMqttUnpublishRecursively } from "../src/useMqttUnpublishRecursively"

const mocks = vi.hoisted(() => ({
  mqttClient: {
    unpublishRecursively: vi.fn(),
  } as unknown as MqttClient,
  httpClient: {} as HttpClient,
}))

vi.mock("../src/useMqtt", () => ({
  useMqtt: () => mocks.mqttClient,
}))

vi.mock("../src/useHttpClient", () => ({
  useHttpClient: () => mocks.httpClient,
}))

describe("useMqttUnpublishRecursively", () => {
  it("should call client.unpublishRecursively with correct arguments", async () => {
    const { result } = renderHook(() => useMqttUnpublishRecursively())
    const unpublishRecursively = result.current

    const topic = "test/topic"
    const options = { batchSize: 10 }

    await unpublishRecursively(topic, options)

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(mocks.mqttClient.unpublishRecursively).toHaveBeenCalledWith(
      topic,
      mocks.httpClient,
      options,
    )
  })
})
