import { MqttClient } from "@artcom/mqtt-topping"
import { render, screen, waitFor } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { MqttProvider } from "../src/MqttProvider/MqttProvider"

vi.mock("@artcom/mqtt-topping", () => {
  return {
    HttpClient: vi.fn().mockImplementation(() => ({ queryJson: vi.fn() })),
    MqttClient: {
      connect: vi.fn(),
    },
  }
})

describe("MqttProvider", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("renders suspenseFallback while the MQTT connection is pending", async () => {
    let resolveConnection!: (client: MqttClient) => void
    const connectionPromise = new Promise<MqttClient>((resolve) => {
      resolveConnection = resolve
    })

    // eslint-disable-next-line @typescript-eslint/unbound-method
    vi.mocked(MqttClient.connect).mockReturnValue(connectionPromise)

    const disconnect = vi.fn()

    render(
      <MqttProvider
        uri="tcp://localhost:1883"
        suspenseFallback={<div>Connecting to MQTT...</div>}
      >
        <div>Ready</div>
      </MqttProvider>,
    )

    expect(screen.getByText("Connecting to MQTT...")).toBeInTheDocument()
    expect(screen.queryByText("Ready")).not.toBeInTheDocument()

    resolveConnection({ disconnect } as unknown as MqttClient)

    await waitFor(() => {
      expect(screen.getByText("Ready")).toBeInTheDocument()
    })
  })

  it("renders children immediately when suspenseFallback is not provided", () => {
    const neverSettlesPromise = new Promise<MqttClient>((_resolve) => {
      // Intentionally unresolved: keeps the connection in-flight for this assertion.
    })

    // eslint-disable-next-line @typescript-eslint/unbound-method
    vi.mocked(MqttClient.connect).mockReturnValue(neverSettlesPromise)

    render(
      <MqttProvider uri="tcp://localhost:1883">
        <div>Ready</div>
      </MqttProvider>,
    )

    expect(screen.getByText("Ready")).toBeInTheDocument()
  })
})
