import { QueryClient } from "@tanstack/react-query"

import type { HttpQuery } from "mqtt-topping"

import {
  cacheUtils,
  errorHandling,
  queryClientConfig,
  queryKeys,
  retryConfig,
} from "../queryUtils"

describe("queryUtils", () => {
  describe("queryKeys", () => {
    it("should generate correct query key for single HTTP query", () => {
      const query: HttpQuery = {
        topic: "test/topic",
        depth: 1,
        flatten: false,
        parseJson: true,
      }

      const key = queryKeys.httpQuery(query)
      expect(key).toEqual(["mqtt-http-query", "test/topic", 1, false, true])
    })

    it("should generate correct query key for batch HTTP queries", () => {
      const queries: HttpQuery[] = [
        { topic: "test/topic1", depth: 1 },
        { topic: "test/topic2", depth: 2 },
      ]

      const key = queryKeys.httpQueryBatch(queries)
      expect(key).toEqual(["mqtt-http-query-batch", JSON.stringify(queries)])
    })

    it("should generate correct query key for JSON query", () => {
      const key = queryKeys.httpQueryJson("test/topic")
      expect(key).toEqual(["mqtt-http-query-json", "test/topic"])
    })

    it("should generate correct query key for JSON batch queries", () => {
      const topics = ["topic1", "topic2"]
      const key = queryKeys.httpQueryJsonBatch(topics)
      expect(key).toEqual([
        "mqtt-http-query-json-batch",
        JSON.stringify(topics),
      ])
    })

    it("should generate base query key", () => {
      const key = queryKeys.all()
      expect(key).toEqual(["mqtt-topping"])
    })

    it("should generate topic-specific query key", () => {
      const key = queryKeys.topic("test/topic")
      expect(key).toEqual(["mqtt-topping", "topic", "test/topic"])
    })
  })

  describe("errorHandling", () => {
    it("should not retry after 3 attempts", () => {
      const error = new Error("Test error")
      const shouldRetry = errorHandling.shouldRetry(3, error)
      expect(shouldRetry).toBe(false)
    })

    it("should not retry on client errors", () => {
      const error = new Error("Client error")
      error.name = "HttpRequestError"
      const shouldRetry = errorHandling.shouldRetry(1, error)
      expect(shouldRetry).toBe(false)
    })

    it("should retry on network errors", () => {
      const error = new Error("Network error")
      error.name = "HttpNetworkError"
      const shouldRetry = errorHandling.shouldRetry(1, error)
      expect(shouldRetry).toBe(true)
    })

    it("should calculate retry delay with exponential backoff", () => {
      const delay1 = errorHandling.retryDelay(0)
      const delay2 = errorHandling.retryDelay(1)

      expect(delay1).toBeGreaterThan(1000)
      expect(delay1).toBeLessThan(1200) // 1000 + 10% jitter
      expect(delay2).toBeGreaterThan(2000)
      expect(delay2).toBeLessThan(2400) // 2000 + 10% jitter
    })

    it("should determine error boundary usage correctly", () => {
      const criticalError = new Error("Critical error")
      criticalError.name = "MqttConnectionError"
      expect(errorHandling.useErrorBoundary(criticalError)).toBe(true)

      const normalError = new Error("Normal error")
      normalError.name = "HttpRequestError"
      expect(errorHandling.useErrorBoundary(normalError)).toBe(false)
    })
  })

  describe("retryConfig", () => {
    it("should provide default retry configuration", () => {
      expect(retryConfig.default.retry).toBe(errorHandling.shouldRetry)
      expect(retryConfig.default.retryDelay).toBe(errorHandling.retryDelay)
    })

    it("should provide aggressive retry configuration", () => {
      expect(retryConfig.aggressive.retry).toBe(5)
      expect(typeof retryConfig.aggressive.retryDelay).toBe("function")
    })

    it("should provide conservative retry configuration", () => {
      expect(retryConfig.conservative.retry).toBe(1)
      expect(retryConfig.conservative.retryDelay).toBe(2000)
    })

    it("should provide no retry configuration", () => {
      expect(retryConfig.none.retry).toBe(false)
      expect(retryConfig.none.retryDelay).toBe(0)
    })
  })

  describe("queryClientConfig", () => {
    it("should create default configuration", () => {
      const config = queryClientConfig.createDefault()
      expect(config.defaultOptions.queries.staleTime).toBe(5 * 60 * 1000)
      expect(config.defaultOptions.queries.gcTime).toBe(10 * 60 * 1000)
      expect(config.defaultOptions.queries.retry).toBe(
        errorHandling.shouldRetry,
      )
    })

    it("should create development configuration", () => {
      const config = queryClientConfig.createDevelopment()
      expect(config.defaultOptions.queries.staleTime).toBe(30 * 1000)
      expect(config.defaultOptions.queries.refetchOnWindowFocus).toBe(true)
      expect(config.defaultOptions.queries.refetchOnMount).toBe("always")
    })

    it("should create production configuration", () => {
      const config = queryClientConfig.createProduction()
      expect(config.defaultOptions.queries.staleTime).toBe(10 * 60 * 1000)
      expect(config.defaultOptions.queries.refetchOnWindowFocus).toBe(false)
      expect(config.defaultOptions.queries.gcTime).toBe(30 * 60 * 1000)
    })

    it("should create QueryClient instance", () => {
      const client = queryClientConfig.create()
      expect(client).toBeInstanceOf(QueryClient)
    })
  })

  describe("cacheUtils", () => {
    let queryClient: QueryClient

    beforeEach(() => {
      queryClient = new QueryClient({
        defaultOptions: {
          queries: {
            retry: false,
          },
        },
      })
    })

    afterEach(() => {
      queryClient.clear()
    })

    it("should invalidate all queries", async () => {
      const spy = jest.spyOn(queryClient, "invalidateQueries")
      await cacheUtils.invalidateAll(queryClient)
      expect(spy).toHaveBeenCalledWith({
        queryKey: queryKeys.all(),
      })
    })

    it("should invalidate topic-specific queries", async () => {
      const spy = jest.spyOn(queryClient, "invalidateQueries")
      await cacheUtils.invalidateTopic(queryClient, "test/topic")
      expect(spy).toHaveBeenCalledWith({
        queryKey: queryKeys.topic("test/topic"),
      })
    })

    it("should clear all queries", () => {
      const spy = jest.spyOn(queryClient, "removeQueries")
      cacheUtils.clearAll(queryClient)
      expect(spy).toHaveBeenCalledWith({
        queryKey: queryKeys.all(),
      })
    })

    it("should clear topic-specific queries", () => {
      const spy = jest.spyOn(queryClient, "removeQueries")
      cacheUtils.clearTopic(queryClient, "test/topic")
      expect(spy).toHaveBeenCalledWith({
        queryKey: queryKeys.topic("test/topic"),
      })
    })

    it("should prefetch data", async () => {
      const spy = jest.spyOn(queryClient, "prefetchQuery")
      const queryKey = ["test"]
      const queryFn = jest.fn().mockResolvedValue("test data")

      await cacheUtils.prefetch(queryClient, queryKey, queryFn, {
        staleTime: 1000,
      })

      expect(spy).toHaveBeenCalledWith({
        queryKey,
        queryFn,
        staleTime: 1000,
      })
    })
  })
})
