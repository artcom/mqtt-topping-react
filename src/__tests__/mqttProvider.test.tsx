import "@testing-library/jest-dom"

import { render, renderHook, screen } from "@testing-library/react"

import React from "react"

import {
  type HttpClient,
  type MessageCallback,
  type MqttClient,
} from "mqtt-topping"

import { MqttContext, MqttProvider, useMqttContext } from "../mqttProvider"

// Mock clients
const mockMqttClient = {
  publish: jest.fn(),
  unpublish: jest.fn(),
  subscribe: jest.fn(),
  unsubscribe: jest.fn(),
} as unknown as MqttClient

const mockHttpClient = {
  query: jest.fn(),
  queryBatch: jest.fn(),
  queryJson: jest.fn(),
  queryJsonBatch: jest.fn(),
} as unknown as HttpClient

// Test component to access context
const TestComponent: React.FC = () => {
  const context = useMqttContext()
  return (
    <div>
      <div data-testid="mqtt-client-available">
        {context.mqttClient ? "true" : "false"}
      </div>
      <div data-testid="http-client-available">
        {context.httpClient ? "true" : "false"}
      </div>
      <div data-testid="publish-available">
        {context.publish ? "true" : "false"}
      </div>
      <div data-testid="unpublish-available">
        {context.unpublish ? "true" : "false"}
      </div>
      <div data-testid="subscribe-available">
        {context.subscribe ? "true" : "false"}
      </div>
      <div data-testid="unsubscribe-available">
        {context.unsubscribe ? "true" : "false"}
      </div>
    </div>
  )
}

describe("MqttProvider", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("Context Value Creation and Updates", () => {
    it("should provide empty context when no clients are provided", () => {
      render(
        <MqttProvider>
          <TestComponent />
        </MqttProvider>,
      )

      expect(screen.getByTestId("mqtt-client-available")).toHaveTextContent(
        "false",
      )
      expect(screen.getByTestId("http-client-available")).toHaveTextContent(
        "false",
      )
      expect(screen.getByTestId("publish-available")).toHaveTextContent("false")
      expect(screen.getByTestId("unpublish-available")).toHaveTextContent(
        "false",
      )
      expect(screen.getByTestId("subscribe-available")).toHaveTextContent(
        "false",
      )
      expect(screen.getByTestId("unsubscribe-available")).toHaveTextContent(
        "false",
      )
    })

    it("should provide mqtt client when provided", () => {
      render(
        <MqttProvider mqttClient={mockMqttClient}>
          <TestComponent />
        </MqttProvider>,
      )

      expect(screen.getByTestId("mqtt-client-available")).toHaveTextContent(
        "true",
      )
      expect(screen.getByTestId("http-client-available")).toHaveTextContent(
        "false",
      )
      expect(screen.getByTestId("publish-available")).toHaveTextContent("true")
      expect(screen.getByTestId("unpublish-available")).toHaveTextContent(
        "true",
      )
      expect(screen.getByTestId("subscribe-available")).toHaveTextContent(
        "true",
      )
      expect(screen.getByTestId("unsubscribe-available")).toHaveTextContent(
        "true",
      )
    })

    it("should provide http client when provided", () => {
      render(
        <MqttProvider httpClient={mockHttpClient}>
          <TestComponent />
        </MqttProvider>,
      )

      expect(screen.getByTestId("mqtt-client-available")).toHaveTextContent(
        "false",
      )
      expect(screen.getByTestId("http-client-available")).toHaveTextContent(
        "true",
      )
      expect(screen.getByTestId("publish-available")).toHaveTextContent("false")
      expect(screen.getByTestId("unpublish-available")).toHaveTextContent(
        "false",
      )
      expect(screen.getByTestId("subscribe-available")).toHaveTextContent(
        "false",
      )
      expect(screen.getByTestId("unsubscribe-available")).toHaveTextContent(
        "false",
      )
    })

    it("should provide both clients when both are provided", () => {
      render(
        <MqttProvider mqttClient={mockMqttClient} httpClient={mockHttpClient}>
          <TestComponent />
        </MqttProvider>,
      )

      expect(screen.getByTestId("mqtt-client-available")).toHaveTextContent(
        "true",
      )
      expect(screen.getByTestId("http-client-available")).toHaveTextContent(
        "true",
      )
      expect(screen.getByTestId("publish-available")).toHaveTextContent("true")
      expect(screen.getByTestId("unpublish-available")).toHaveTextContent(
        "true",
      )
      expect(screen.getByTestId("subscribe-available")).toHaveTextContent(
        "true",
      )
      expect(screen.getByTestId("unsubscribe-available")).toHaveTextContent(
        "true",
      )
    })

    it("should update context when clients change", () => {
      const { rerender } = render(
        <MqttProvider>
          <TestComponent />
        </MqttProvider>,
      )

      expect(screen.getByTestId("mqtt-client-available")).toHaveTextContent(
        "false",
      )

      rerender(
        <MqttProvider mqttClient={mockMqttClient}>
          <TestComponent />
        </MqttProvider>,
      )

      expect(screen.getByTestId("mqtt-client-available")).toHaveTextContent(
        "true",
      )
      expect(screen.getByTestId("publish-available")).toHaveTextContent("true")
    })
  })

  describe("Client Prop Handling and Bound Methods", () => {
    it("should create bound publish method that calls mqttClient.publish", async () => {
      const { result } = renderHook(() => useMqttContext(), {
        wrapper: ({ children }) => (
          <MqttProvider mqttClient={mockMqttClient}>{children}</MqttProvider>
        ),
      })

      const testTopic = "test/topic"
      const testData = { message: "hello" }
      const testOptions = { qos: 1 as const }

      await result.current.publish!(testTopic, testData, testOptions)

      expect(mockMqttClient.publish).toHaveBeenCalledWith(
        testTopic,
        testData,
        testOptions,
      )
    })

    it("should create bound unpublish method that calls mqttClient.unpublish", async () => {
      const { result } = renderHook(() => useMqttContext(), {
        wrapper: ({ children }) => (
          <MqttProvider mqttClient={mockMqttClient}>{children}</MqttProvider>
        ),
      })

      const testTopic = "test/topic"
      const testQos = 1 as const

      await result.current.unpublish!(testTopic, testQos)

      expect(mockMqttClient.unpublish).toHaveBeenCalledWith(testTopic, testQos)
    })

    it("should create bound subscribe method that calls mqttClient.subscribe", async () => {
      const { result } = renderHook(() => useMqttContext(), {
        wrapper: ({ children }) => (
          <MqttProvider mqttClient={mockMqttClient}>{children}</MqttProvider>
        ),
      })

      const testTopic = "test/topic"
      const testCallback: MessageCallback = jest.fn()
      const testOptions = { qos: 1 as const }

      await result.current.subscribe!(testTopic, testCallback, testOptions)

      expect(mockMqttClient.subscribe).toHaveBeenCalledWith(
        testTopic,
        testCallback,
        testOptions,
      )
    })

    it("should create bound unsubscribe method that calls mqttClient.unsubscribe", async () => {
      const { result } = renderHook(() => useMqttContext(), {
        wrapper: ({ children }) => (
          <MqttProvider mqttClient={mockMqttClient}>{children}</MqttProvider>
        ),
      })

      const testTopic = "test/topic"
      const testCallback: MessageCallback = jest.fn()

      await result.current.unsubscribe!(testTopic, testCallback)

      expect(mockMqttClient.unsubscribe).toHaveBeenCalledWith(
        testTopic,
        testCallback,
      )
    })

    it("should not create bound methods when mqttClient is not provided", () => {
      const { result } = renderHook(() => useMqttContext(), {
        wrapper: ({ children }) => (
          <MqttProvider httpClient={mockHttpClient}>{children}</MqttProvider>
        ),
      })

      expect(result.current.publish).toBeUndefined()
      expect(result.current.unpublish).toBeUndefined()
      expect(result.current.subscribe).toBeUndefined()
      expect(result.current.unsubscribe).toBeUndefined()
    })

    it("should preserve client references in context value", () => {
      const { result } = renderHook(() => useMqttContext(), {
        wrapper: ({ children }) => (
          <MqttProvider mqttClient={mockMqttClient} httpClient={mockHttpClient}>
            {children}
          </MqttProvider>
        ),
      })

      expect(result.current.mqttClient).toBe(mockMqttClient)
      expect(result.current.httpClient).toBe(mockHttpClient)
    })
  })

  describe("Cleanup Behavior on Unmount", () => {
    it("should not throw errors when provider unmounts with clients", () => {
      const { unmount } = render(
        <MqttProvider mqttClient={mockMqttClient} httpClient={mockHttpClient}>
          <TestComponent />
        </MqttProvider>,
      )

      expect(() => unmount()).not.toThrow()
    })

    it("should not throw errors when provider unmounts without clients", () => {
      const { unmount } = render(
        <MqttProvider>
          <TestComponent />
        </MqttProvider>,
      )

      expect(() => unmount()).not.toThrow()
    })

    it("should handle cleanup effect properly", () => {
      // Since we removed the cleanup effect (as it was empty and unnecessary),
      // this test now verifies that the provider can be unmounted without issues
      const { unmount } = render(
        <MqttProvider mqttClient={mockMqttClient}>
          <TestComponent />
        </MqttProvider>,
      )

      // Verify unmounting doesn't throw errors
      expect(() => unmount()).not.toThrow()
    })
  })

  describe("Error Scenarios and Edge Cases", () => {
    it("should handle null mqttClient gracefully", () => {
      expect(() =>
        render(
          <MqttProvider mqttClient={null as any}>
            <TestComponent />
          </MqttProvider>,
        ),
      ).not.toThrow()
    })

    it("should handle undefined mqttClient gracefully", () => {
      expect(() =>
        render(
          <MqttProvider>
            <TestComponent />
          </MqttProvider>,
        ),
      ).not.toThrow()
    })

    it("should handle null httpClient gracefully", () => {
      expect(() =>
        render(
          <MqttProvider httpClient={null as any}>
            <TestComponent />
          </MqttProvider>,
        ),
      ).not.toThrow()
    })

    it("should handle undefined httpClient gracefully", () => {
      expect(() =>
        render(
          <MqttProvider>
            <TestComponent />
          </MqttProvider>,
        ),
      ).not.toThrow()
    })

    it("should handle errors in bound methods gracefully", async () => {
      const errorMqttClient = {
        publish: jest.fn().mockRejectedValue(new Error("Publish failed")),
        unpublish: jest.fn().mockRejectedValue(new Error("Unpublish failed")),
        subscribe: jest.fn().mockRejectedValue(new Error("Subscribe failed")),
        unsubscribe: jest
          .fn()
          .mockRejectedValue(new Error("Unsubscribe failed")),
      } as unknown as MqttClient

      const { result } = renderHook(() => useMqttContext(), {
        wrapper: ({ children }) => (
          <MqttProvider mqttClient={errorMqttClient}>{children}</MqttProvider>
        ),
      })

      // Test that errors are properly propagated
      await expect(result.current.publish!("test", "data")).rejects.toThrow(
        "Publish failed",
      )
      await expect(result.current.unpublish!("test")).rejects.toThrow(
        "Unpublish failed",
      )
      await expect(
        result.current.subscribe!("test", jest.fn()),
      ).rejects.toThrow("Subscribe failed")
      await expect(
        result.current.unsubscribe!("test", jest.fn()),
      ).rejects.toThrow("Unsubscribe failed")
    })

    it("should handle rapid client changes without memory leaks", () => {
      const { rerender } = render(
        <MqttProvider mqttClient={mockMqttClient}>
          <TestComponent />
        </MqttProvider>,
      )

      // Rapidly change clients
      for (let i = 0; i < 10; i++) {
        const newMockClient = {
          publish: jest.fn(),
          unpublish: jest.fn(),
          subscribe: jest.fn(),
          unsubscribe: jest.fn(),
        } as unknown as MqttClient

        rerender(
          <MqttProvider mqttClient={newMockClient}>
            <TestComponent />
          </MqttProvider>,
        )
      }

      expect(screen.getByTestId("mqtt-client-available")).toHaveTextContent(
        "true",
      )
    })

    it("should maintain context stability when clients do not change", () => {
      let contextValue1: any
      let contextValue2: any

      const TestContextStability: React.FC = () => {
        const context = useMqttContext()
        if (!contextValue1) {
          contextValue1 = context
        } else if (!contextValue2) {
          contextValue2 = context
        }
        return null
      }

      const { rerender } = render(
        <MqttProvider mqttClient={mockMqttClient} httpClient={mockHttpClient}>
          <TestContextStability />
        </MqttProvider>,
      )

      rerender(
        <MqttProvider mqttClient={mockMqttClient} httpClient={mockHttpClient}>
          <TestContextStability />
        </MqttProvider>,
      )

      // Context should be stable when clients don't change (due to useMemo)
      expect(contextValue1).toBe(contextValue2)
    })

    it("should handle missing context gracefully", () => {
      // Test using context outside of provider
      const { result } = renderHook(() => useMqttContext())

      expect(result.current).toEqual({})
      expect(result.current.mqttClient).toBeUndefined()
      expect(result.current.httpClient).toBeUndefined()
      expect(result.current.publish).toBeUndefined()
    })

    it("should handle children prop edge cases", () => {
      expect(() =>
        render(<MqttProvider mqttClient={mockMqttClient}>{null}</MqttProvider>),
      ).not.toThrow()

      expect(() =>
        render(
          <MqttProvider mqttClient={mockMqttClient}>{undefined}</MqttProvider>,
        ),
      ).not.toThrow()

      expect(() =>
        render(
          <MqttProvider mqttClient={mockMqttClient}>{false}</MqttProvider>,
        ),
      ).not.toThrow()
    })
  })

  describe("MqttContext Direct Usage", () => {
    it("should provide default empty context", () => {
      const TestDirectContext: React.FC = () => {
        const context = React.useContext(MqttContext)
        return <div data-testid="direct-context">{JSON.stringify(context)}</div>
      }

      render(<TestDirectContext />)

      expect(screen.getByTestId("direct-context")).toHaveTextContent("{}")
    })

    it("should allow direct context consumption", () => {
      const TestDirectContext: React.FC = () => {
        const context = React.useContext(MqttContext)
        return (
          <div data-testid="has-mqtt-client">
            {context.mqttClient ? "true" : "false"}
          </div>
        )
      }

      render(
        <MqttProvider mqttClient={mockMqttClient}>
          <TestDirectContext />
        </MqttProvider>,
      )

      expect(screen.getByTestId("has-mqtt-client")).toHaveTextContent("true")
    })
  })
})
