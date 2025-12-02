import { MqttClient } from "@artcom/mqtt-topping"
import { renderHook, waitFor } from "@testing-library/react"
import React from "react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { MqttProvider } from "../src/MqttProvider/MqttProvider"
import { useMqtt } from "../src/useMqtt"

// Mock the MqttClient class
vi.mock("@artcom/mqtt-topping", () => {
  return {
    MqttClient: {
      connect: vi.fn(),
    },
  }
})

describe("useMqtt", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("should throw error if used outside MqttProvider", () => {
    // Suppress console.error for this test as React logs errors when components throw
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {})

    expect(() => {
      renderHook(() => useMqtt())
    }).toThrow("useMqttContext must be used within an MqttProvider")

    consoleSpy.mockRestore()
  })

  it("should provide the client when used within MqttProvider", async () => {
    const mockClient = {
      some: "client",
      disconnect: vi.fn(),
    } as unknown as MqttClient

    // eslint-disable-next-line @typescript-eslint/unbound-method
    vi.mocked(MqttClient.connect).mockResolvedValue(mockClient)

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <MqttProvider uri="tcp://localhost:1883">{children}</MqttProvider>
    )

    const { result } = renderHook(() => useMqtt(), { wrapper })

    // Initially null
    expect(result.current).toBeNull()

    // Wait for connection
    await waitFor(() => {
      expect(result.current).toBe(mockClient)
    })

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(MqttClient.connect).toHaveBeenCalledWith(
      "tcp://localhost:1883",
      undefined,
    )
  })
})
