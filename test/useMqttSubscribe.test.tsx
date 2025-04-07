import React, { FC, useState, useCallback } from "react"
import { render, render as rtlRerender, act } from "@testing-library/react"
import { MqttProvider, useMqttSubscribe } from "../src"
import { createHttpClientMock, createMqttClientMock, MockMqttClient } from "./utils"
import type { MessageCallback, MqttSubscribeOptions } from "@artcom/mqtt-topping"

const defaultTopic = "testTopic"
const defaultHandler: MessageCallback = jest.fn()
const defaultOptions: MqttSubscribeOptions = { qos: 2, parseType: "json" }

interface TestComponentProps {
  topic?: string
  handler?: MessageCallback
  options?: MqttSubscribeOptions
}

const TestComponent: FC<TestComponentProps> = ({
  topic = defaultTopic,
  handler = defaultHandler,
  options = defaultOptions,
}) => {
  useMqttSubscribe(topic, handler, options)
  return null
}

describe("useMqttSubscribe", () => {
  let mqttClient: MockMqttClient
  let consoleWarnSpy: jest.SpyInstance
  let consoleErrorSpy: jest.SpyInstance

  beforeEach(() => {
    mqttClient = createMqttClientMock()
    ;(defaultHandler as jest.Mock).mockClear()
    consoleWarnSpy = jest.spyOn(console, "warn").mockImplementation()
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation()
  })

  afterEach(() => {
    consoleWarnSpy.mockRestore()
    consoleErrorSpy.mockRestore()
  })

  it("should call subscribe with topic, handler, and options", () => {
    render(
      <MqttProvider mqttClient={mqttClient}>
        <TestComponent />
      </MqttProvider>,
    )

    expect(mqttClient.subscribe).toHaveBeenCalledTimes(1)
    expect(mqttClient.subscribe).toHaveBeenCalledWith(
      defaultTopic,
      expect.any(Function),
      defaultOptions,
    )
    expect(mqttClient.unsubscribe).not.toHaveBeenCalled()
  })

  it("should call unsubscribe with topic and wrapped handler on unmount", () => {
    const { unmount } = render(
      <MqttProvider mqttClient={mqttClient}>
        <TestComponent />
      </MqttProvider>,
    )

    const handlerWrapper = (mqttClient.subscribe as jest.Mock).mock.calls[0][1]

    unmount()

    expect(mqttClient.subscribe).toHaveBeenCalledTimes(1)
    expect(mqttClient.unsubscribe).toHaveBeenCalledTimes(1)
    expect(mqttClient.unsubscribe).toHaveBeenCalledWith(defaultTopic, handlerWrapper)
  })

  it("should resubscribe if topic changes", () => {
    const { rerender } = render(
      <MqttProvider mqttClient={mqttClient}>
        <TestComponent />
      </MqttProvider>,
    )

    const handlerWrapper1 = (mqttClient.subscribe as jest.Mock).mock.calls[0][1]
    const updatedTopic = "updatedTopic"

    rerender(
      <MqttProvider mqttClient={mqttClient}>
        <TestComponent topic={updatedTopic} />
      </MqttProvider>,
    )

    const handlerWrapper2 = (mqttClient.subscribe as jest.Mock).mock.calls[1][1]

    expect(mqttClient.subscribe).toHaveBeenCalledTimes(2)
    expect(mqttClient.subscribe).toHaveBeenNthCalledWith(
      1,
      defaultTopic,
      handlerWrapper1,
      defaultOptions,
    )
    expect(mqttClient.subscribe).toHaveBeenNthCalledWith(
      2,
      updatedTopic,
      handlerWrapper2,
      defaultOptions,
    )
    expect(mqttClient.unsubscribe).toHaveBeenCalledTimes(1)
    expect(mqttClient.unsubscribe).toHaveBeenCalledWith(defaultTopic, handlerWrapper1)
  })

  it("should resubscribe if options change (using stringify)", () => {
    const { rerender } = render(
      <MqttProvider mqttClient={mqttClient}>
        <TestComponent />
      </MqttProvider>,
    )

    const handlerWrapper1 = (mqttClient.subscribe as jest.Mock).mock.calls[0][1]
    const updatedOptions: MqttSubscribeOptions = { qos: 0, parseType: "string" }

    rerender(
      <MqttProvider mqttClient={mqttClient}>
        <TestComponent options={updatedOptions} />
      </MqttProvider>,
    )

    const handlerWrapper2 = (mqttClient.subscribe as jest.Mock).mock.calls[1][1]

    expect(mqttClient.subscribe).toHaveBeenCalledTimes(2)
    expect(mqttClient.subscribe).toHaveBeenNthCalledWith(
      1,
      defaultTopic,
      handlerWrapper1,
      defaultOptions,
    )
    expect(mqttClient.subscribe).toHaveBeenNthCalledWith(
      2,
      defaultTopic,
      handlerWrapper2,
      updatedOptions,
    )
    expect(mqttClient.unsubscribe).toHaveBeenCalledTimes(1)
    expect(mqttClient.unsubscribe).toHaveBeenCalledWith(defaultTopic, handlerWrapper1)
  })

  it("should NOT resubscribe if handler reference changes but is stable via useCallback/useRef", () => {
    const WrapperComponent = () => {
      const [count, setCount] = useState(0)
      const stableHandler = useCallback<MessageCallback>(() => {
        console.log("Handler called with count:", count)
      }, [count])

      return (
        <>
          <button onClick={() => setCount((c) => c + 1)}>Inc</button>
          <TestComponent handler={stableHandler} />
        </>
      )
    }

    const { rerender } = render(
      <MqttProvider mqttClient={mqttClient}>
        <WrapperComponent />
      </MqttProvider>,
    )

    expect(mqttClient.subscribe).toHaveBeenCalledTimes(1)
    const initialWrapper = (mqttClient.subscribe as jest.Mock).mock.calls[0][1]

    rerender(
      <MqttProvider mqttClient={mqttClient}>
        <WrapperComponent />
      </MqttProvider>,
    )

    expect(mqttClient.subscribe).toHaveBeenCalledTimes(1)
    expect(mqttClient.unsubscribe).not.toHaveBeenCalled()

    act(() => {
      initialWrapper("payload", defaultTopic, {})
    })
  })

  it("should warn if subscribe fails", async () => {
    const subscribeError = new Error("Subscribe Failed")
    ;(mqttClient.subscribe as jest.Mock).mockRejectedValueOnce(subscribeError)

    render(
      <MqttProvider mqttClient={mqttClient}>
        <TestComponent />
      </MqttProvider>,
    )

    await act(async () => {
      await Promise.resolve()
    })

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      `Failed to subscribe to topic "${defaultTopic}":`,
      subscribeError,
    )
  })

  it("should warn if unsubscribe fails", async () => {
    const unsubscribeError = new Error("Unsubscribe Failed")
    ;(mqttClient.unsubscribe as jest.Mock).mockRejectedValueOnce(unsubscribeError)

    const { unmount } = render(
      <MqttProvider mqttClient={mqttClient}>
        <TestComponent />
      </MqttProvider>,
    )

    unmount()

    await act(async () => {
      await Promise.resolve()
    })

    expect(consoleWarnSpy).toHaveBeenCalledWith(
      `Failed to unsubscribe from topic "${defaultTopic}":`,
      unsubscribeError,
    )
  })

  it.skip("should warn if context does not provide subscribe/unsubscribe", () => {
    consoleWarnSpy.mockImplementation((message) => {})

    render(
      <MqttProvider httpClient={createHttpClientMock()}>
        <TestComponent />
      </MqttProvider>,
    )

    expect(consoleWarnSpy).toHaveBeenCalledWith(
      "useMqttSubscribe: MqttClient not available in context.",
    )
  })
})
