import { MqttClient } from "@artcom/mqtt-topping"
import { renderHook, waitFor } from "@testing-library/react"
import React from "react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { MqttProvider } from "../src/MqttProvider/MqttProvider"
import { useMqttSubscribe } from "../src/useMqttSubscribe"

// Mock the MqttClient class
vi.mock("@artcom/mqtt-topping", () => {
  return {
    MqttClient: {
      connect: vi.fn(),
    },
  }
})

describe("useMqttSubscribe", () => {
  let mockClient: {
    subscribe: ReturnType<typeof vi.fn>
    unsubscribe: ReturnType<typeof vi.fn>
    disconnect: ReturnType<typeof vi.fn>
  }

  beforeEach(() => {
    vi.clearAllMocks()
    mockClient = {
      subscribe: vi.fn(),
      unsubscribe: vi.fn(),
      disconnect: vi.fn(),
    }
    // eslint-disable-next-line @typescript-eslint/unbound-method
    vi.mocked(MqttClient.connect).mockResolvedValue(
      mockClient as unknown as MqttClient,
    )
  })

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <MqttProvider uri="tcp://localhost:1883">{children}</MqttProvider>
  )

  it("should subscribe to topic when client is connected", async () => {
    const handler = vi.fn()
    renderHook(
      () => {
        useMqttSubscribe("test/topic", handler)
      },
      { wrapper },
    )

    await waitFor(() => {
      expect(mockClient.subscribe).toHaveBeenCalledWith(
        "test/topic",
        expect.any(Function),
      )
    })
  })

  it("should unsubscribe from topic on unmount", async () => {
    const handler = vi.fn()
    const { unmount } = renderHook(
      () => {
        useMqttSubscribe("test/topic", handler)
      },
      { wrapper },
    )

    await waitFor(() => {
      expect(mockClient.subscribe).toHaveBeenCalled()
    })

    unmount()

    expect(mockClient.unsubscribe).toHaveBeenCalledWith(
      "test/topic",
      expect.any(Function),
    )
  })

  it("should not re-subscribe when handler changes", async () => {
    const handler1 = vi.fn()
    const handler2 = vi.fn()

    const { rerender } = renderHook(
      ({ handler }) => {
        useMqttSubscribe("test/topic", handler)
      },
      {
        wrapper,
        initialProps: { handler: handler1 },
      },
    )

    await waitFor(() => {
      expect(mockClient.subscribe).toHaveBeenCalledTimes(1)
    })

    // Rerender with new handler
    rerender({ handler: handler2 })

    // Should not have subscribed again
    expect(mockClient.subscribe).toHaveBeenCalledTimes(1)
    expect(mockClient.unsubscribe).not.toHaveBeenCalled()
  })

  it("should re-subscribe when topic changes", async () => {
    const handler = vi.fn()

    const { rerender } = renderHook(
      ({ topic }) => {
        useMqttSubscribe(topic, handler)
      },
      {
        wrapper,
        initialProps: { topic: "test/topic1" },
      },
    )

    await waitFor(() => {
      expect(mockClient.subscribe).toHaveBeenCalledWith(
        "test/topic1",
        expect.any(Function),
      )
    })

    // Rerender with new topic
    rerender({ topic: "test/topic2" })

    await waitFor(() => {
      expect(mockClient.unsubscribe).toHaveBeenCalledWith(
        "test/topic1",
        expect.any(Function),
      )
      expect(mockClient.subscribe).toHaveBeenCalledWith(
        "test/topic2",
        expect.any(Function),
      )
    })
  })

  it("should allow multiple subscriptions to the same topic", async () => {
    const handler1 = vi.fn()
    const handler2 = vi.fn()

    renderHook(
      () => {
        useMqttSubscribe("test/shared-topic", handler1)
        useMqttSubscribe("test/shared-topic", handler2)
      },
      { wrapper },
    )

    await waitFor(() => {
      // Should be called twice for the same topic
      expect(mockClient.subscribe).toHaveBeenCalledTimes(2)
      expect(mockClient.subscribe).toHaveBeenCalledWith(
        "test/shared-topic",
        expect.any(Function),
      )
    })
  })
})
