import { HttpClient, MqttClient } from "@artcom/mqtt-topping"
import { renderHook, waitFor } from "@testing-library/react"
import React from "react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { useMqttContext } from "../src/MqttProvider/MqttContext"
import { MqttProvider } from "../src/MqttProvider/MqttProvider"
import { useHttpClient } from "../src/useHttpClient"

// Mock the MqttClient and HttpClient classes
vi.mock("@artcom/mqtt-topping", () => {
  return {
    MqttClient: {
      connect: vi.fn(),
    },
    HttpClient: vi.fn(),
  }
})

describe("useHttpClient", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // eslint-disable-next-line @typescript-eslint/unbound-method
    vi.mocked(MqttClient.connect).mockResolvedValue({
      disconnect: vi.fn(),
    } as unknown as MqttClient)
  })

  it("should return null if httpBrokerUri is not provided", async () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <MqttProvider uri="tcp://localhost:1883">{children}</MqttProvider>
    )

    const { result } = renderHook(
      () => {
        const client = useHttpClient()
        const { status } = useMqttContext()
        return { client, status }
      },
      { wrapper },
    )

    expect(result.current.client).toBeNull()

    await waitFor(() => {
      expect(result.current.status).toBe("connected")
    })
  })

  it("should return HttpClient instance if httpBrokerUri is provided", async () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <MqttProvider
        uri="tcp://localhost:1883"
        httpBrokerUri="http://localhost:8080"
      >
        {children}
      </MqttProvider>
    )

    const { result } = renderHook(
      () => {
        const client = useHttpClient()
        const { status } = useMqttContext()
        return { client, status }
      },
      { wrapper },
    )

    expect(HttpClient).toHaveBeenCalledWith("http://localhost:8080", undefined)
    expect(result.current.client).toBeInstanceOf(HttpClient)

    await waitFor(() => {
      expect(result.current.status).toBe("connected")
    })
  })

  it("should pass httpOptions to HttpClient", async () => {
    const httpOptions = { requestTimeoutMs: 5000 }
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <MqttProvider
        uri="tcp://localhost:1883"
        httpBrokerUri="http://localhost:8080"
        httpOptions={httpOptions}
      >
        {children}
      </MqttProvider>
    )

    const { result } = renderHook(
      () => {
        const client = useHttpClient()
        const { status } = useMqttContext()
        return { client, status }
      },
      { wrapper },
    )

    expect(HttpClient).toHaveBeenCalledWith(
      "http://localhost:8080",
      httpOptions,
    )

    await waitFor(() => {
      expect(result.current.status).toBe("connected")
    })
  })
})
