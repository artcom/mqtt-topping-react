import { act, renderHook, waitFor } from "@testing-library/react"

import React from "react"

import { type MessageCallback, type MqttClient } from "mqtt-topping"

import { MqttProvider } from "../mqttProvider"
import { useMqttSubscribe } from "../useMqttSubscribe"

// Mock console.warn to avoid noise in tests
const originalWarn = console.warn
beforeAll(() => {
  console.warn = jest.fn()
})

afterAll(() => {
  console.warn = originalWarn
})

// Mock MQTT client
const createMockMqttClient = (
  overrides: Partial<MqttClient> = {},
): MqttClient =>
  ({
    publish: jest.fn(),
    unpublish: jest.fn(),
    subscribe: jest.fn().mockResolvedValue(undefined),
    unsubscribe: jest.fn().mockResolvedValue(undefined),
    ...overrides,
  }) as unknown as MqttClient

// Test wrapper component
const createWrapper = (mqttClient?: MqttClient) => {
  const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <MqttProvider {...(mqttClient ? { mqttClient } : {})}>
      {children}
    </MqttProvider>
  )
  return Wrapper
}

describe("useMqttSubscribe", () => {
  let mockMqttClient: MqttClient
  let mockHandler: MessageCallback

  beforeEach(() => {
    jest.clearAllMocks()
    mockMqttClient = createMockMqttClient()
    mockHandler = jest.fn()
  })

  describe("Subscription Lifecycle (mount, unmount, cleanup)", () => {
    it("should subscribe to topic on mount when enabled", async () => {
      const { result } = renderHook(
        () => useMqttSubscribe("test/topic", mockHandler),
        {
          wrapper: createWrapper(mockMqttClient),
        },
      )

      await waitFor(() => {
        expect(mockMqttClient.subscribe).toHaveBeenCalledWith(
          "test/topic",
          mockHandler,
          {},
        )
      })

      await waitFor(() => {
        expect(result.current.isSubscribed).toBe(true)
      })

      expect(result.current.error).toBe(null)
    })

    it("should not subscribe on mount when enabled is false", async () => {
      const { result } = renderHook(
        () => useMqttSubscribe("test/topic", mockHandler, { enabled: false }),
        {
          wrapper: createWrapper(mockMqttClient),
        },
      )

      // Wait a bit to ensure no subscription happens
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 10))
      })

      expect(mockMqttClient.subscribe).not.toHaveBeenCalled()
      expect(result.current.isSubscribed).toBe(false)
      expect(result.current.error).toBe(null)
    })

    it("should unsubscribe on unmount", async () => {
      const { result, unmount } = renderHook(
        () => useMqttSubscribe("test/topic", mockHandler),
        {
          wrapper: createWrapper(mockMqttClient),
        },
      )

      await waitFor(() => {
        expect(result.current.isSubscribed).toBe(true)
      })

      unmount()

      expect(mockMqttClient.unsubscribe).toHaveBeenCalledWith(
        "test/topic",
        mockHandler,
      )
    })

    it("should handle cleanup when unsubscribe fails", async () => {
      const mockClientWithFailingUnsubscribe = createMockMqttClient({
        unsubscribe: jest
          .fn()
          .mockRejectedValue(new Error("Unsubscribe failed")),
      })

      const { result, unmount } = renderHook(
        () => useMqttSubscribe("test/topic", mockHandler),
        {
          wrapper: createWrapper(mockClientWithFailingUnsubscribe),
        },
      )

      await waitFor(() => {
        expect(result.current.isSubscribed).toBe(true)
      })

      // Should not throw when unmounting even if unsubscribe fails
      expect(() => unmount()).not.toThrow()

      await waitFor(() => {
        expect(console.warn).toHaveBeenCalledWith(
          "Failed to unsubscribe from topic:",
          "test/topic",
          expect.any(Error),
        )
      })
    })

    it("should resubscribe when topic changes", async () => {
      const { result, rerender } = renderHook(
        ({ topic }) => useMqttSubscribe(topic, mockHandler),
        {
          wrapper: createWrapper(mockMqttClient),
          initialProps: { topic: "test/topic1" },
        },
      )

      await waitFor(() => {
        expect(result.current.isSubscribed).toBe(true)
      })

      expect(mockMqttClient.subscribe).toHaveBeenCalledWith(
        "test/topic1",
        mockHandler,
        {},
      )

      // Change topic
      rerender({ topic: "test/topic2" })

      await waitFor(() => {
        expect(mockMqttClient.unsubscribe).toHaveBeenCalledWith(
          "test/topic1",
          mockHandler,
        )
      })

      await waitFor(() => {
        expect(mockMqttClient.subscribe).toHaveBeenCalledWith(
          "test/topic2",
          mockHandler,
          {},
        )
      })
    })

    it("should resubscribe when handler changes", async () => {
      const newHandler = jest.fn()
      const { result, rerender } = renderHook(
        ({ handler }) => useMqttSubscribe("test/topic", handler),
        {
          wrapper: createWrapper(mockMqttClient),
          initialProps: { handler: mockHandler },
        },
      )

      await waitFor(() => {
        expect(result.current.isSubscribed).toBe(true)
      })

      expect(mockMqttClient.subscribe).toHaveBeenCalledWith(
        "test/topic",
        mockHandler,
        {},
      )

      // Change handler
      rerender({ handler: newHandler })

      await waitFor(() => {
        expect(mockMqttClient.unsubscribe).toHaveBeenCalledWith(
          "test/topic",
          mockHandler,
        )
      })

      await waitFor(() => {
        expect(mockMqttClient.subscribe).toHaveBeenCalledWith(
          "test/topic",
          newHandler,
          {},
        )
      })
    })

    it("should pass subscription options to mqtt client", async () => {
      const options = { qos: 1 as const, retain: true }

      renderHook(() => useMqttSubscribe("test/topic", mockHandler, options), {
        wrapper: createWrapper(mockMqttClient),
      })

      await waitFor(() => {
        expect(mockMqttClient.subscribe).toHaveBeenCalledWith(
          "test/topic",
          mockHandler,
          {
            qos: 1,
            retain: true,
          },
        )
      })
    })
  })

  describe("Enabled/Disabled Functionality", () => {
    it("should subscribe when enabled changes from false to true", async () => {
      const { result, rerender } = renderHook(
        ({ enabled }) =>
          useMqttSubscribe("test/topic", mockHandler, { enabled }),
        {
          wrapper: createWrapper(mockMqttClient),
          initialProps: { enabled: false },
        },
      )

      // Initially not subscribed
      expect(result.current.isSubscribed).toBe(false)
      expect(mockMqttClient.subscribe).not.toHaveBeenCalled()

      // Enable subscription
      rerender({ enabled: true })

      await waitFor(() => {
        expect(mockMqttClient.subscribe).toHaveBeenCalledWith(
          "test/topic",
          mockHandler,
          {},
        )
      })

      await waitFor(() => {
        expect(result.current.isSubscribed).toBe(true)
      })
    })

    it("should unsubscribe when enabled changes from true to false", async () => {
      const { result, rerender } = renderHook(
        ({ enabled }) =>
          useMqttSubscribe("test/topic", mockHandler, { enabled }),
        {
          wrapper: createWrapper(mockMqttClient),
          initialProps: { enabled: true },
        },
      )

      await waitFor(() => {
        expect(result.current.isSubscribed).toBe(true)
      })

      // Disable subscription
      rerender({ enabled: false })

      await waitFor(() => {
        expect(mockMqttClient.unsubscribe).toHaveBeenCalledWith(
          "test/topic",
          mockHandler,
        )
      })

      await waitFor(() => {
        expect(result.current.isSubscribed).toBe(false)
      })
    })

    it("should remain unsubscribed when enabled is false and other props change", async () => {
      const { result, rerender } = renderHook(
        ({ topic, enabled }) =>
          useMqttSubscribe(topic, mockHandler, { enabled }),
        {
          wrapper: createWrapper(mockMqttClient),
          initialProps: { topic: "test/topic1", enabled: false },
        },
      )

      expect(result.current.isSubscribed).toBe(false)
      expect(mockMqttClient.subscribe).not.toHaveBeenCalled()

      // Change topic while disabled
      rerender({ topic: "test/topic2", enabled: false })

      // Should still not subscribe
      expect(result.current.isSubscribed).toBe(false)
      expect(mockMqttClient.subscribe).not.toHaveBeenCalled()
      expect(mockMqttClient.unsubscribe).not.toHaveBeenCalled()
    })

    it("should handle enabled option with other subscription options", async () => {
      const options = { enabled: true, qos: 2 as const }

      renderHook(() => useMqttSubscribe("test/topic", mockHandler, options), {
        wrapper: createWrapper(mockMqttClient),
      })

      await waitFor(() => {
        expect(mockMqttClient.subscribe).toHaveBeenCalledWith(
          "test/topic",
          mockHandler,
          { qos: 2 },
        )
      })
    })
  })

  describe("Error Handling and State Updates", () => {
    it("should handle subscription errors and update error state", async () => {
      const subscribeError = new Error("Subscription failed")
      const mockClientWithError = createMockMqttClient({
        subscribe: jest.fn().mockRejectedValue(subscribeError),
      })

      const { result } = renderHook(
        () => useMqttSubscribe("test/topic", mockHandler),
        {
          wrapper: createWrapper(mockClientWithError),
        },
      )

      await waitFor(() => {
        expect(result.current.error).toEqual(subscribeError)
      })

      expect(result.current.isSubscribed).toBe(false)
    })

    it("should handle non-Error subscription failures", async () => {
      const mockClientWithError = createMockMqttClient({
        subscribe: jest.fn().mockRejectedValue("String error"),
      })

      const { result } = renderHook(
        () => useMqttSubscribe("test/topic", mockHandler),
        {
          wrapper: createWrapper(mockClientWithError),
        },
      )

      await waitFor(() => {
        expect(result.current.error).toBeInstanceOf(Error)
        expect(result.current.error?.message).toBe("Subscription failed")
      })

      expect(result.current.isSubscribed).toBe(false)
    })

    it("should clear error state on successful subscription after error", async () => {
      let shouldFail = true
      const mockClientWithConditionalError = createMockMqttClient({
        subscribe: jest.fn().mockImplementation(() => {
          if (shouldFail) {
            return Promise.reject(new Error("Subscription failed"))
          }
          return Promise.resolve()
        }),
      })

      const { result, rerender } = renderHook(
        ({ enabled }) =>
          useMqttSubscribe("test/topic", mockHandler, { enabled }),
        {
          wrapper: createWrapper(mockClientWithConditionalError),
          initialProps: { enabled: true },
        },
      )

      // Wait for initial error
      await waitFor(() => {
        expect(result.current.error).toBeInstanceOf(Error)
      })

      expect(result.current.isSubscribed).toBe(false)

      // Fix the error condition and retry
      shouldFail = false
      rerender({ enabled: false })
      rerender({ enabled: true })

      await waitFor(() => {
        expect(result.current.error).toBe(null)
      })

      await waitFor(() => {
        expect(result.current.isSubscribed).toBe(true)
      })
    })

    it("should handle missing MQTT client", async () => {
      const { result } = renderHook(
        () => useMqttSubscribe("test/topic", mockHandler),
        {
          wrapper: createWrapper(undefined),
        },
      )

      await waitFor(() => {
        expect(result.current.error).toBeInstanceOf(Error)
        expect(result.current.error?.message).toBe("MQTT client not available")
      })

      expect(result.current.isSubscribed).toBe(false)
    })

    it("should handle missing subscribe method in context", async () => {
      // Create a provider with no mqttClient to simulate missing subscribe method
      const { result } = renderHook(
        () => useMqttSubscribe("test/topic", mockHandler),
        {
          wrapper: createWrapper(undefined),
        },
      )

      await waitFor(() => {
        expect(result.current.error).toBeInstanceOf(Error)
        expect(result.current.error?.message).toBe("MQTT client not available")
      })

      expect(result.current.isSubscribed).toBe(false)
    })

    it("should update state correctly during subscription lifecycle", async () => {
      const { result } = renderHook(
        () => useMqttSubscribe("test/topic", mockHandler),
        {
          wrapper: createWrapper(mockMqttClient),
        },
      )

      // Initially not subscribed
      expect(result.current.isSubscribed).toBe(false)
      expect(result.current.error).toBe(null)

      // After successful subscription
      await waitFor(() => {
        expect(result.current.isSubscribed).toBe(true)
      })

      expect(result.current.error).toBe(null)
    })
  })

  describe("Subscription Management with Multiple Components", () => {
    it("should handle multiple components subscribing to same topic", async () => {
      const handler1 = jest.fn()
      const handler2 = jest.fn()

      const { result: result1 } = renderHook(
        () => useMqttSubscribe("test/topic", handler1),
        {
          wrapper: createWrapper(mockMqttClient),
        },
      )

      const { result: result2 } = renderHook(
        () => useMqttSubscribe("test/topic", handler2),
        {
          wrapper: createWrapper(mockMqttClient),
        },
      )

      await waitFor(() => {
        expect(result1.current.isSubscribed).toBe(true)
        expect(result2.current.isSubscribed).toBe(true)
      })

      // Both should have called subscribe with their respective handlers
      expect(mockMqttClient.subscribe).toHaveBeenCalledWith(
        "test/topic",
        handler1,
        {},
      )
      expect(mockMqttClient.subscribe).toHaveBeenCalledWith(
        "test/topic",
        handler2,
        {},
      )
      expect(mockMqttClient.subscribe).toHaveBeenCalledTimes(2)
    })

    it("should handle multiple components subscribing to different topics", async () => {
      const handler1 = jest.fn()
      const handler2 = jest.fn()

      const { result: result1 } = renderHook(
        () => useMqttSubscribe("test/topic1", handler1),
        {
          wrapper: createWrapper(mockMqttClient),
        },
      )

      const { result: result2 } = renderHook(
        () => useMqttSubscribe("test/topic2", handler2),
        {
          wrapper: createWrapper(mockMqttClient),
        },
      )

      await waitFor(() => {
        expect(result1.current.isSubscribed).toBe(true)
        expect(result2.current.isSubscribed).toBe(true)
      })

      expect(mockMqttClient.subscribe).toHaveBeenCalledWith(
        "test/topic1",
        handler1,
        {},
      )
      expect(mockMqttClient.subscribe).toHaveBeenCalledWith(
        "test/topic2",
        handler2,
        {},
      )
      expect(mockMqttClient.subscribe).toHaveBeenCalledTimes(2)
    })

    it("should handle independent cleanup for multiple components", async () => {
      const handler1 = jest.fn()
      const handler2 = jest.fn()

      const { result: result1, unmount: unmount1 } = renderHook(
        () => useMqttSubscribe("test/topic", handler1),
        {
          wrapper: createWrapper(mockMqttClient),
        },
      )

      const { result: result2, unmount: unmount2 } = renderHook(
        () => useMqttSubscribe("test/topic", handler2),
        {
          wrapper: createWrapper(mockMqttClient),
        },
      )

      await waitFor(() => {
        expect(result1.current.isSubscribed).toBe(true)
        expect(result2.current.isSubscribed).toBe(true)
      })

      // Unmount first component
      unmount1()

      expect(mockMqttClient.unsubscribe).toHaveBeenCalledWith(
        "test/topic",
        handler1,
      )
      expect(mockMqttClient.unsubscribe).toHaveBeenCalledTimes(1)

      // Second component should still be subscribed
      expect(result2.current.isSubscribed).toBe(true)

      // Unmount second component
      unmount2()

      expect(mockMqttClient.unsubscribe).toHaveBeenCalledWith(
        "test/topic",
        handler2,
      )
      expect(mockMqttClient.unsubscribe).toHaveBeenCalledTimes(2)
    })

    it("should handle error in one component without affecting others", async () => {
      const handler1 = jest.fn()
      const handler2 = jest.fn()

      let callCount = 0
      const mockClientWithSelectiveError = createMockMqttClient({
        subscribe: jest.fn().mockImplementation((_topic, _handler) => {
          callCount++
          if (callCount === 1) {
            return Promise.reject(new Error("First subscription failed"))
          }
          return Promise.resolve()
        }),
      })

      const { result: result1 } = renderHook(
        () => useMqttSubscribe("test/topic", handler1),
        {
          wrapper: createWrapper(mockClientWithSelectiveError),
        },
      )

      const { result: result2 } = renderHook(
        () => useMqttSubscribe("test/topic", handler2),
        {
          wrapper: createWrapper(mockClientWithSelectiveError),
        },
      )

      await waitFor(() => {
        expect(result1.current.error).toBeInstanceOf(Error)
        expect(result2.current.isSubscribed).toBe(true)
      })

      expect(result1.current.isSubscribed).toBe(false)
      expect(result2.current.error).toBe(null)
    })

    it("should handle different enabled states across components", async () => {
      const handler1 = jest.fn()
      const handler2 = jest.fn()

      const { result: result1 } = renderHook(
        () => useMqttSubscribe("test/topic", handler1, { enabled: true }),
        {
          wrapper: createWrapper(mockMqttClient),
        },
      )

      const { result: result2 } = renderHook(
        () => useMqttSubscribe("test/topic", handler2, { enabled: false }),
        {
          wrapper: createWrapper(mockMqttClient),
        },
      )

      await waitFor(() => {
        expect(result1.current.isSubscribed).toBe(true)
      })

      expect(result2.current.isSubscribed).toBe(false)
      expect(mockMqttClient.subscribe).toHaveBeenCalledWith(
        "test/topic",
        handler1,
        {},
      )
      expect(mockMqttClient.subscribe).toHaveBeenCalledTimes(1)
    })

    it("should handle shared MQTT client across multiple hook instances", async () => {
      const sharedClient = createMockMqttClient()
      const handler1 = jest.fn()
      const handler2 = jest.fn()

      // Create two separate wrapper instances with the same client
      const Wrapper1: React.FC<{ children: React.ReactNode }> = ({
        children,
      }) => <MqttProvider mqttClient={sharedClient}>{children}</MqttProvider>

      const Wrapper2: React.FC<{ children: React.ReactNode }> = ({
        children,
      }) => <MqttProvider mqttClient={sharedClient}>{children}</MqttProvider>

      const { result: result1 } = renderHook(
        () => useMqttSubscribe("test/topic1", handler1),
        {
          wrapper: Wrapper1,
        },
      )

      const { result: result2 } = renderHook(
        () => useMqttSubscribe("test/topic2", handler2),
        {
          wrapper: Wrapper2,
        },
      )

      await waitFor(() => {
        expect(result1.current.isSubscribed).toBe(true)
        expect(result2.current.isSubscribed).toBe(true)
      })

      // Both should use the same client instance
      expect(sharedClient.subscribe).toHaveBeenCalledWith(
        "test/topic1",
        handler1,
        {},
      )
      expect(sharedClient.subscribe).toHaveBeenCalledWith(
        "test/topic2",
        handler2,
        {},
      )
      expect(sharedClient.subscribe).toHaveBeenCalledTimes(2)
    })
  })

  describe("Edge Cases and Advanced Scenarios", () => {
    it("should handle rapid enable/disable toggling", async () => {
      const { result, rerender } = renderHook(
        ({ enabled }) =>
          useMqttSubscribe("test/topic", mockHandler, { enabled }),
        {
          wrapper: createWrapper(mockMqttClient),
          initialProps: { enabled: true },
        },
      )

      await waitFor(() => {
        expect(result.current.isSubscribed).toBe(true)
      })

      // Rapidly toggle enabled state
      for (let i = 0; i < 5; i++) {
        rerender({ enabled: false })
        rerender({ enabled: true })
      }

      // Should end up subscribed
      await waitFor(() => {
        expect(result.current.isSubscribed).toBe(true)
      })

      expect(result.current.error).toBe(null)
    })

    it("should handle subscription when client becomes available", async () => {
      const { result: result1 } = renderHook(
        () => useMqttSubscribe("test/topic", mockHandler),
        {
          wrapper: ({ children }) => <MqttProvider>{children}</MqttProvider>,
        },
      )

      // Initially should have error due to missing client
      await waitFor(() => {
        expect(result1.current.error).toBeInstanceOf(Error)
      })

      expect(result1.current.isSubscribed).toBe(false)

      // Create a new hook instance with client available
      const { result: result2 } = renderHook(
        () => useMqttSubscribe("test/topic", mockHandler),
        {
          wrapper: createWrapper(mockMqttClient),
        },
      )

      await waitFor(() => {
        expect(result2.current.isSubscribed).toBe(true)
      })

      expect(mockMqttClient.subscribe).toHaveBeenCalledWith(
        "test/topic",
        mockHandler,
        {},
      )
    })

    it("should handle subscription options changes", async () => {
      const { result, rerender } = renderHook(
        ({ options }) => useMqttSubscribe("test/topic", mockHandler, options),
        {
          wrapper: createWrapper(mockMqttClient),
          initialProps: { options: { qos: 0 } },
        },
      )

      await waitFor(() => {
        expect(result.current.isSubscribed).toBe(true)
      })

      expect(mockMqttClient.subscribe).toHaveBeenCalledWith(
        "test/topic",
        mockHandler,
        { qos: 0 },
      )

      // Change options
      rerender({ options: { qos: 1 } })

      await waitFor(() => {
        expect(mockMqttClient.unsubscribe).toHaveBeenCalledWith(
          "test/topic",
          mockHandler,
        )
      })

      await waitFor(() => {
        expect(mockMqttClient.subscribe).toHaveBeenCalledWith(
          "test/topic",
          mockHandler,
          { qos: 1 },
        )
      })
    })

    it("should maintain subscription state consistency during async operations", async () => {
      let resolveSubscribe: () => void
      const subscribePromise = new Promise<void>((resolve) => {
        resolveSubscribe = resolve
      })

      const mockClientWithDelayedSubscribe = createMockMqttClient({
        subscribe: jest.fn().mockReturnValue(subscribePromise),
      })

      const { result, unmount } = renderHook(
        () => useMqttSubscribe("test/topic", mockHandler),
        {
          wrapper: createWrapper(mockClientWithDelayedSubscribe),
        },
      )

      // Initially not subscribed while subscription is pending
      expect(result.current.isSubscribed).toBe(false)
      expect(result.current.error).toBe(null)

      // Unmount before subscription completes
      unmount()

      // Complete the subscription
      resolveSubscribe!()

      // Wait for any potential state updates
      await act(async () => {
        await subscribePromise
      })

      // Should not throw or cause issues
      expect(mockClientWithDelayedSubscribe.subscribe).toHaveBeenCalled()
    })
  })
})
