import { HttpClient } from "@artcom/mqtt-topping"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { render, renderHook, waitFor } from "@testing-library/react"
import React from "react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { useMqttContext } from "../src/MqttProvider/MqttContext"
import { MqttProvider } from "../src/MqttProvider/MqttProvider"
import { useMqttQueryBatch } from "../src/useMqttQueryBatch"

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

describe("useMqttQueryBatch", () => {
  let queryClient: QueryClient
  let mockHttpClient: { queryJsonBatch: ReturnType<typeof vi.fn> }

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
      queryJsonBatch: vi
        .fn()
        .mockResolvedValue([{ foo: "bar" }, { baz: "qux" }]),
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

  it("should fetch data using httpClient.queryJsonBatch", async () => {
    const topics = ["test/topic1", "test/topic2"]
    const { result } = renderHook(
      () => {
        const query = useMqttQueryBatch(topics)
        const { status } = useMqttContext()
        return { query, status }
      },
      { wrapper },
    )

    await waitFor(() => {
      expect(result.current.query.isSuccess).toBe(true)
    })

    expect(result.current.query.data).toEqual([{ foo: "bar" }, { baz: "qux" }])
    expect(mockHttpClient.queryJsonBatch).toHaveBeenCalledWith(topics)

    await waitFor(() => {
      expect(result.current.status).toBe("connected")
    })
  })

  it("should handle errors", async () => {
    const error = new Error("Fetch failed")
    mockHttpClient.queryJsonBatch.mockRejectedValue(error)

    const { result } = renderHook(
      () => {
        const query = useMqttQueryBatch(["test/topic"], { retry: false })
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
        const query = useMqttQueryBatch(["test/topic"])
        const { status } = useMqttContext()
        return { query, status }
      },
      { wrapper: wrapperWithoutHttp },
    )

    // Should be pending/idle because enabled is false
    expect(result.current.query.status).toBe("pending")
    expect(result.current.query.fetchStatus).toBe("idle")

    // Should not have called anything
    expect(mockHttpClient.queryJsonBatch).not.toHaveBeenCalled()

    await waitFor(() => {
      expect(result.current.status).toBe("connected")
    })
  })

  it("should refetch when httpBrokerUri changes", async () => {
    function TestComponent() {
      useMqttQueryBatch(["test/topic"])
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
      expect(mockHttpClient.queryJsonBatch).toHaveBeenCalledTimes(1)
    })

    // Change httpBrokerUri
    rerender(<App uri="http://broker2" />)

    // Should have been called again because the key changed
    await waitFor(() => {
      expect(mockHttpClient.queryJsonBatch).toHaveBeenCalledTimes(2)
    })
  })
})
