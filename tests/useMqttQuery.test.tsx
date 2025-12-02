import { HttpClient } from "@artcom/mqtt-topping"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { render, renderHook, waitFor } from "@testing-library/react"
import React from "react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { useMqttContext } from "../src/MqttProvider/MqttContext"
import { MqttProvider } from "../src/MqttProvider/MqttProvider"
import { useMqttQuery } from "../src/useMqttQuery"

// Mock HttpClient
vi.mock("@artcom/mqtt-topping", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@artcom/mqtt-topping")>()
  return {
    ...actual,
    HttpClient: vi.fn(),
    MqttClient: {
      connect: vi.fn().mockResolvedValue({ disconnect: vi.fn() }),
    },
  }
})

describe("useMqttQuery", () => {
  let queryClient: QueryClient
  let mockHttpClient: { queryJson: ReturnType<typeof vi.fn> }

  beforeEach(() => {
    vi.clearAllMocks()
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    })

    mockHttpClient = {
      queryJson: vi.fn().mockResolvedValue({ foo: "bar" }),
    }
    // Use a regular function because arrow functions cannot be used as constructors
    vi.mocked(HttpClient).mockImplementation(function () {
      return mockHttpClient as unknown as HttpClient
    })
  })

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <MqttProvider
        uri="tcp://localhost:1883"
        httpBrokerUri="http://localhost:8080"
      >
        {children}
      </MqttProvider>
    </QueryClientProvider>
  )

  it("should fetch data using httpClient", async () => {
    const { result } = renderHook(
      () => {
        const query = useMqttQuery("test/topic")
        const { status } = useMqttContext()
        return { query, status }
      },
      { wrapper },
    )

    await waitFor(() => {
      expect(result.current.query.isSuccess).toBe(true)
    })

    expect(result.current.query.data).toEqual({ foo: "bar" })
    expect(mockHttpClient.queryJson).toHaveBeenCalledWith("test/topic")

    await waitFor(() => {
      expect(result.current.status).toBe("connected")
    })
  })

  it("should handle errors", async () => {
    const error = new Error("Fetch failed")
    mockHttpClient.queryJson.mockRejectedValue(error)

    const { result } = renderHook(
      () => {
        const query = useMqttQuery("test/topic")
        const { status } = useMqttContext()
        return { query, status }
      },
      { wrapper },
    )

    await waitFor(() => {
      expect(result.current.query.isError).toBe(true)
    })

    expect(result.current.query.error).toEqual(error)

    await waitFor(() => {
      expect(result.current.status).toBe("connected")
    })
  })

  it("should be disabled if httpClient is not available", async () => {
    const wrapperWithoutHttp = ({
      children,
    }: {
      children: React.ReactNode
    }) => (
      <QueryClientProvider client={queryClient}>
        <MqttProvider uri="tcp://localhost:1883">{children}</MqttProvider>
      </QueryClientProvider>
    )

    const { result } = renderHook(
      () => {
        const query = useMqttQuery("test/topic")
        const { status } = useMqttContext()
        return { query, status }
      },
      { wrapper: wrapperWithoutHttp },
    )

    // Should be pending/idle because enabled is false
    expect(result.current.query.status).toBe("pending")
    expect(result.current.query.fetchStatus).toBe("idle")

    // Should not have called anything
    expect(mockHttpClient.queryJson).not.toHaveBeenCalled()

    await waitFor(() => {
      expect(result.current.status).toBe("connected")
    })
  })

  it("should refetch when httpBrokerUri changes", async () => {
    function TestComponent() {
      useMqttQuery("test/topic")
      return null
    }

    const App = ({ uri }: { uri: string }) => (
      <QueryClientProvider client={queryClient}>
        <MqttProvider uri="tcp://localhost:1883" httpBrokerUri={uri}>
          <TestComponent />
        </MqttProvider>
      </QueryClientProvider>
    )

    const { rerender } = render(<App uri="http://broker1" />)

    await waitFor(() => {
      expect(mockHttpClient.queryJson).toHaveBeenCalledTimes(1)
    })

    // Change httpBrokerUri
    rerender(<App uri="http://broker2" />)

    // Should have been called again because the key changed
    await waitFor(() => {
      expect(mockHttpClient.queryJson).toHaveBeenCalledTimes(2)
    })
  })
})
