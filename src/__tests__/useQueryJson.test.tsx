import { act, renderHook, waitFor } from "@testing-library/react"

import React from "react"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

import { type HttpClient, type HttpJsonResult } from "mqtt-topping"

import { MqttProvider } from "../mqttProvider"
import { useQueryJson } from "../useQueryJson"

// Mock console.warn to avoid noise in tests
const originalWarn = console.warn
beforeAll(() => {
  console.warn = jest.fn()
})

afterAll(() => {
  console.warn = originalWarn
})

// Mock HttpClient
const createMockHttpClient = (
  overrides: Partial<HttpClient> = {},
): HttpClient =>
  ({
    query: jest.fn(),
    queryBatch: jest.fn(),
    queryJson: jest.fn(),
    ...overrides,
  }) as unknown as HttpClient

// Test wrapper component with QueryClient and MqttProvider
const createWrapper = (httpClient?: HttpClient, queryClient?: QueryClient) => {
  const client =
    queryClient ||
    new QueryClient({
      defaultOptions: {
        queries: {
          retry: false, // Disable retries for faster tests
          gcTime: 0, // Disable caching for predictable tests
        },
      },
    })

  const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <QueryClientProvider client={client}>
      <MqttProvider {...(httpClient ? { httpClient } : {})}>
        {children}
      </MqttProvider>
    </QueryClientProvider>
  )
  return Wrapper
}

describe("useQueryJson", () => {
  let mockHttpClient: HttpClient
  let queryClient: QueryClient

  beforeEach(() => {
    jest.clearAllMocks()
    mockHttpClient = createMockHttpClient()
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
          gcTime: 0,
        },
      },
    })
  })

  describe("Basic JSON Query Functionality", () => {
    it("should execute JSON query with HttpClient when enabled", async () => {
      const mockResult: HttpJsonResult = {
        topic: "test/topic",
        payload: { message: "hello", count: 42 },
        timestamp: new Date().toISOString(),
      }

      const mockQueryJson = jest.fn().mockResolvedValue(mockResult)
      const mockClient = createMockHttpClient({
        queryJson: mockQueryJson,
      })

      const topic = "test/topic"

      const { result } = renderHook(() => useQueryJson(topic), {
        wrapper: createWrapper(mockClient, queryClient),
      })

      // First verify the query is actually being executed
      await waitFor(() => {
        expect(mockQueryJson).toHaveBeenCalled()
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(mockQueryJson).toHaveBeenCalledWith(topic)
      expect(result.current.data).toEqual(mockResult)
      expect(result.current.error).toBe(null)
    })

    it("should not execute query when httpClient is not available", async () => {
      const topic = "test/topic"

      const { result } = renderHook(() => useQueryJson(topic), {
        wrapper: createWrapper(undefined, queryClient),
      })

      // Should not execute query - disabled queries are not loading but may be pending
      expect(result.current.isLoading).toBe(false)
      expect(result.current.isFetching).toBe(false)
      expect(result.current.isError).toBe(false)
      expect(result.current.data).toBeUndefined()
    })

    it("should not execute query when topic is empty", async () => {
      const mockClient = createMockHttpClient({
        queryJson: jest.fn().mockResolvedValue({ topic: "", payload: null }),
      })

      const { result } = renderHook(() => useQueryJson(""), {
        wrapper: createWrapper(mockClient, queryClient),
      })

      // Wait a bit to ensure no query happens
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 10))
      })

      expect(mockClient.queryJson).not.toHaveBeenCalled()
      expect(result.current.isLoading).toBe(false)
      expect(result.current.isFetching).toBe(false)
      expect(result.current.data).toBeUndefined()
    })

    it("should not execute query when enabled is false", async () => {
      const mockClient = createMockHttpClient({
        queryJson: jest
          .fn()
          .mockResolvedValue({ topic: "test/topic", payload: null }),
      })

      const topic = "test/topic"

      const { result } = renderHook(
        () => useQueryJson(topic, { enabled: false }),
        {
          wrapper: createWrapper(mockClient, queryClient),
        },
      )

      // Wait a bit to ensure no query happens
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 10))
      })

      expect(mockClient.queryJson).not.toHaveBeenCalled()
      expect(result.current.isLoading).toBe(false)
      expect(result.current.isFetching).toBe(false)
      expect(result.current.data).toBeUndefined()
    })

    it("should handle JSON query with complex payload", async () => {
      const mockResult: HttpJsonResult = {
        topic: "test/topic",
        payload: {
          user: { id: 123, name: "John Doe" },
          settings: { theme: "dark", notifications: true },
          data: [1, 2, 3, 4, 5],
          metadata: {
            version: "1.0.0",
            timestamp: "2023-01-01T00:00:00Z",
          },
        },
        timestamp: new Date().toISOString(),
      }

      const mockClient = createMockHttpClient({
        queryJson: jest.fn().mockResolvedValue(mockResult),
      })

      const topic = "test/topic"

      const { result } = renderHook(() => useQueryJson(topic), {
        wrapper: createWrapper(mockClient, queryClient),
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(mockClient.queryJson).toHaveBeenCalledWith(topic)
      expect(result.current.data).toEqual(mockResult)
      expect((result.current.data as any)?.payload).toEqual(mockResult.payload)
    })

    it("should generate correct query key based on topic", async () => {
      const mockClient = createMockHttpClient({
        queryJson: jest
          .fn()
          .mockResolvedValue({ topic: "test/topic", payload: null }),
      })

      const topic1 = "test/topic1"
      const topic2 = "test/topic2"

      const { result: result1 } = renderHook(() => useQueryJson(topic1), {
        wrapper: createWrapper(mockClient, queryClient),
      })

      const { result: result2 } = renderHook(() => useQueryJson(topic2), {
        wrapper: createWrapper(mockClient, queryClient),
      })

      await waitFor(() => {
        expect(result1.current.isSuccess).toBe(true)
        expect(result2.current.isSuccess).toBe(true)
      })

      // Both queries should have been called independently
      expect(mockClient.queryJson).toHaveBeenCalledTimes(2)
      expect(mockClient.queryJson).toHaveBeenCalledWith(topic1)
      expect(mockClient.queryJson).toHaveBeenCalledWith(topic2)
    })
  })

  describe("Wildcard Validation", () => {
    it("should reject topics with + wildcard", async () => {
      const mockClient = createMockHttpClient({
        queryJson: jest.fn(),
      })

      const topic = "test/+/topic"

      const { result } = renderHook(
        () => useQueryJson(topic, { retry: false }),
        {
          wrapper: createWrapper(mockClient, queryClient),
        },
      )

      await waitFor(() => {
        expect(result.current.isError).toBe(true)
      })

      expect(result.current.error?.message).toContain(
        "Wildcards (+, #) are not supported in useQueryJson",
      )
      expect(mockClient.queryJson).not.toHaveBeenCalled()
    })

    it("should reject topics with # wildcard", async () => {
      const mockClient = createMockHttpClient({
        queryJson: jest.fn(),
      })

      const topic = "test/topic/#"

      const { result } = renderHook(
        () => useQueryJson(topic, { retry: false }),
        {
          wrapper: createWrapper(mockClient, queryClient),
        },
      )

      await waitFor(() => {
        expect(result.current.isError).toBe(true)
      })

      expect(result.current.error?.message).toContain(
        "Wildcards (+, #) are not supported in useQueryJson",
      )
      expect(mockClient.queryJson).not.toHaveBeenCalled()
    })

    it("should reject topics with both wildcards", async () => {
      const mockClient = createMockHttpClient({
        queryJson: jest.fn(),
      })

      const topic = "test/+/topic/#"

      const { result } = renderHook(
        () => useQueryJson(topic, { retry: false }),
        {
          wrapper: createWrapper(mockClient, queryClient),
        },
      )

      await waitFor(() => {
        expect(result.current.isError).toBe(true)
      })

      expect(result.current.error?.message).toContain(
        "Wildcards (+, #) are not supported in useQueryJson",
      )
      expect(mockClient.queryJson).not.toHaveBeenCalled()
    })

    it("should accept topics without wildcards", async () => {
      const mockResult: HttpJsonResult = {
        topic: "test/valid/topic",
        payload: { valid: true },
        timestamp: new Date().toISOString(),
      }

      const mockClient = createMockHttpClient({
        queryJson: jest.fn().mockResolvedValue(mockResult),
      })

      const topic = "test/valid/topic"

      const { result } = renderHook(() => useQueryJson(topic), {
        wrapper: createWrapper(mockClient, queryClient),
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(mockClient.queryJson).toHaveBeenCalledWith(topic)
      expect(result.current.data).toEqual(mockResult)
    })
  })

  describe("Error Handling", () => {
    it("should handle JSON query errors properly", async () => {
      const queryError = new Error("JSON query failed")
      const mockClient = createMockHttpClient({
        queryJson: jest.fn().mockRejectedValue(queryError),
      })

      const topic = "test/topic"

      const { result } = renderHook(
        () => useQueryJson(topic, { retry: false }),
        {
          wrapper: createWrapper(mockClient, queryClient),
        },
      )

      await waitFor(() => {
        expect(result.current.isError).toBe(true)
      })

      // The error is now enhanced with JSON query context
      expect(result.current.error?.message).toBe(
        'JSON query failed for topic "test/topic": JSON query failed',
      )
      expect(result.current.error?.cause).toEqual(queryError)
      expect(result.current.data).toBeUndefined()
    })

    it("should handle missing HttpClient error", async () => {
      const topic = "test/topic"

      const { result } = renderHook(
        () => useQueryJson(topic, { enabled: true }),
        {
          wrapper: createWrapper(undefined, queryClient),
        },
      )

      // Query should be disabled when httpClient is not available
      expect(result.current.isLoading).toBe(false)
      expect(result.current.isFetching).toBe(false)
      expect(result.current.isError).toBe(false)
      expect(result.current.data).toBeUndefined()
    })

    it("should handle HttpClient throwing error during JSON query", async () => {
      const mockClient = createMockHttpClient({
        queryJson: jest.fn().mockImplementation(() => {
          throw new Error(
            "HttpClient not available. Make sure MqttProvider has httpClient prop.",
          )
        }),
      })

      const topic = "test/topic"

      const { result } = renderHook(
        () => useQueryJson(topic, { retry: false }),
        {
          wrapper: createWrapper(mockClient, queryClient),
        },
      )

      await waitFor(() => {
        expect(result.current.isError).toBe(true)
      })

      expect(result.current.error?.message).toBe(
        'JSON query failed for topic "test/topic": HttpClient not available. Make sure MqttProvider has httpClient prop.',
      )
    })

    it("should handle JSON parsing errors", async () => {
      const parseError = new Error("Invalid JSON")
      parseError.name = "HttpPayloadParseError"

      const mockClient = createMockHttpClient({
        queryJson: jest.fn().mockRejectedValue(parseError),
      })

      const topic = "test/topic"

      const { result } = renderHook(
        () => useQueryJson(topic, { retry: false }),
        {
          wrapper: createWrapper(mockClient, queryClient),
        },
      )

      await waitFor(() => {
        expect(result.current.isError).toBe(true)
      })

      // The error is now enhanced with JSON query context
      expect(result.current.error?.message).toBe(
        'JSON query failed for topic "test/topic": Invalid JSON',
      )
      expect(result.current.error?.name).toBe("HttpPayloadParseError")
      expect(result.current.error?.cause).toEqual(parseError)
    })

    it("should handle network errors", async () => {
      const networkError = new Error("Network error")
      networkError.name = "HttpNetworkError"

      const mockQueryJson = jest.fn().mockImplementation(async () => {
        throw networkError
      })
      const mockClient = createMockHttpClient({
        queryJson: mockQueryJson,
      })

      const topic = "test/topic"

      const { result } = renderHook(
        () => useQueryJson(topic, { retry: false }),
        {
          wrapper: createWrapper(mockClient, queryClient),
        },
      )

      // First verify the query is actually being executed
      await waitFor(() => {
        expect(mockQueryJson).toHaveBeenCalled()
      })

      // Then wait for the error state
      await waitFor(
        () => {
          expect(result.current.isError).toBe(true)
        },
        { timeout: 2000 },
      )

      // The error is now enhanced with JSON query context
      expect(result.current.error?.message).toBe(
        'JSON query failed for topic "test/topic": Network error',
      )
      expect(result.current.error?.name).toBe("HttpNetworkError")
      expect(result.current.error?.cause).toEqual(networkError)
    })

    it("should handle topic not found errors", async () => {
      const notFoundError = new Error("Topic not found")
      notFoundError.name = "HttpQueryError"

      const mockClient = createMockHttpClient({
        queryJson: jest.fn().mockRejectedValue(notFoundError),
      })

      const topic = "nonexistent/topic"

      const { result } = renderHook(
        () => useQueryJson(topic, { retry: false }),
        {
          wrapper: createWrapper(mockClient, queryClient),
        },
      )

      await waitFor(() => {
        expect(result.current.isError).toBe(true)
      })

      // The error is now enhanced with JSON query context
      expect(result.current.error?.message).toBe(
        'JSON query failed for topic "nonexistent/topic": Topic not found',
      )
      expect(result.current.error?.name).toBe("HttpQueryError")
      expect(result.current.error?.cause).toEqual(notFoundError)
    })
  })

  describe("TanStack Query Integration", () => {
    it("should support TanStack Query options", async () => {
      const mockResult: HttpJsonResult = {
        topic: "test/topic",
        payload: { message: "hello" },
        timestamp: new Date().toISOString(),
      }

      const mockClient = createMockHttpClient({
        queryJson: jest.fn().mockResolvedValue(mockResult),
      })

      const topic = "test/topic"
      const onSuccess = jest.fn()
      const onError = jest.fn()

      const { result } = renderHook(
        () =>
          useQueryJson(topic, {
            onSuccess,
            onError,
            staleTime: 5000,
          }),
        {
          wrapper: createWrapper(mockClient, queryClient),
        },
      )

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      // Verify the query succeeded and returned the expected data
      expect(result.current.data).toEqual(mockResult)
      expect(result.current.error).toBeNull()
    })

    it("should support data transformation with select", async () => {
      const mockResult: HttpJsonResult = {
        topic: "test/topic",
        payload: { message: "hello", count: 42 },
        timestamp: new Date().toISOString(),
      }

      const mockClient = createMockHttpClient({
        queryJson: jest.fn().mockResolvedValue(mockResult),
      })

      const topic = "test/topic"

      const { result } = renderHook(
        () =>
          useQueryJson(topic, {
            select: (data: HttpJsonResult) => (data as any).payload,
          }),
        {
          wrapper: createWrapper(mockClient, queryClient),
        },
      )

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.data).toEqual(mockResult.payload) // Transformed data
    })

    it("should handle refetch functionality", async () => {
      const mockResult: HttpJsonResult = {
        topic: "test/topic",
        payload: { message: "hello" },
        timestamp: new Date().toISOString(),
      }

      const mockClient = createMockHttpClient({
        queryJson: jest.fn().mockResolvedValue(mockResult),
      })

      const topic = "test/topic"

      const { result } = renderHook(() => useQueryJson(topic), {
        wrapper: createWrapper(mockClient, queryClient),
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(mockClient.queryJson).toHaveBeenCalledTimes(1)

      // Trigger refetch
      await act(async () => {
        await result.current.refetch()
      })

      expect(mockClient.queryJson).toHaveBeenCalledTimes(2)
    })

    it("should handle query invalidation", async () => {
      const mockResult: HttpJsonResult = {
        topic: "test/topic",
        payload: { message: "hello" },
        timestamp: new Date().toISOString(),
      }

      const mockClient = createMockHttpClient({
        queryJson: jest.fn().mockResolvedValue(mockResult),
      })

      const topic = "test/topic"

      const { result } = renderHook(() => useQueryJson(topic), {
        wrapper: createWrapper(mockClient, queryClient),
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(mockClient.queryJson).toHaveBeenCalledTimes(1)

      // Invalidate query
      await act(async () => {
        await queryClient.invalidateQueries({
          queryKey: ["mqtt-http-query-json", topic],
        })
      })

      await waitFor(() => {
        expect(mockClient.queryJson).toHaveBeenCalledTimes(2)
      })
    })
  })

  describe("Query State Management", () => {
    it("should show loading state during JSON query execution", async () => {
      let resolveQuery: (value: HttpJsonResult) => void
      const queryPromise = new Promise<HttpJsonResult>((resolve) => {
        resolveQuery = resolve
      })

      const mockClient = createMockHttpClient({
        queryJson: jest.fn().mockReturnValue(queryPromise),
      })

      const topic = "test/topic"

      const { result } = renderHook(() => useQueryJson(topic), {
        wrapper: createWrapper(mockClient, queryClient),
      })

      // Should be loading initially
      expect(result.current.isPending).toBe(true)
      expect(result.current.isSuccess).toBe(false)
      expect(result.current.isError).toBe(false)

      // Resolve the query
      const mockResult: HttpJsonResult = {
        topic: "test/topic",
        payload: { message: "hello" },
        timestamp: new Date().toISOString(),
      }

      await act(async () => {
        resolveQuery!(mockResult)
        await queryPromise
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.isPending).toBe(false)
      expect(result.current.data).toEqual(mockResult)
    })

    it("should handle topic changes", async () => {
      const mockResult1: HttpJsonResult = {
        topic: "test/topic1",
        payload: { message: "hello1" },
        timestamp: new Date().toISOString(),
      }

      const mockResult2: HttpJsonResult = {
        topic: "test/topic2",
        payload: { message: "hello2" },
        timestamp: new Date().toISOString(),
      }

      const mockClient = createMockHttpClient({
        queryJson: jest
          .fn()
          .mockResolvedValueOnce(mockResult1)
          .mockResolvedValueOnce(mockResult2),
      })

      const { result, rerender } = renderHook(
        ({ topic }) => useQueryJson(topic),
        {
          wrapper: createWrapper(mockClient, queryClient),
          initialProps: { topic: "test/topic1" },
        },
      )

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.data).toEqual(mockResult1)

      // Change topic
      rerender({ topic: "test/topic2" })

      await waitFor(() => {
        expect(result.current.data).toEqual(mockResult2)
      })

      expect(mockClient.queryJson).toHaveBeenCalledTimes(2)
      expect(mockClient.queryJson).toHaveBeenNthCalledWith(1, "test/topic1")
      expect(mockClient.queryJson).toHaveBeenNthCalledWith(2, "test/topic2")
    })

    it("should handle enabled state changes", async () => {
      const mockResult: HttpJsonResult = {
        topic: "test/topic",
        payload: { message: "hello" },
        timestamp: new Date().toISOString(),
      }

      const mockClient = createMockHttpClient({
        queryJson: jest.fn().mockResolvedValue(mockResult),
      })

      const topic = "test/topic"

      const { result, rerender } = renderHook(
        ({ enabled }) => useQueryJson(topic, { enabled }),
        {
          wrapper: createWrapper(mockClient, queryClient),
          initialProps: { enabled: false },
        },
      )

      // Initially disabled - should not be loading but may be pending
      expect(result.current.isLoading).toBe(false)
      expect(result.current.isFetching).toBe(false)
      expect(mockClient.queryJson).not.toHaveBeenCalled()

      // Enable query
      rerender({ enabled: true })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(mockClient.queryJson).toHaveBeenCalledTimes(1)
      expect(result.current.data).toEqual(mockResult)
    })
  })

  describe("Edge Cases", () => {
    it("should handle null JSON payload", async () => {
      const mockResult: HttpJsonResult = {
        topic: "test/topic",
        payload: null,
        timestamp: new Date().toISOString(),
      }

      const mockClient = createMockHttpClient({
        queryJson: jest.fn().mockResolvedValue(mockResult),
      })

      const topic = "test/topic"

      const { result } = renderHook(() => useQueryJson(topic), {
        wrapper: createWrapper(mockClient, queryClient),
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.data).toEqual(mockResult)
      expect((result.current.data as any)?.payload).toBe(null)
    })

    it("should handle empty object JSON payload", async () => {
      const mockResult: HttpJsonResult = {
        topic: "test/topic",
        payload: {},
        timestamp: new Date().toISOString(),
      }

      const mockClient = createMockHttpClient({
        queryJson: jest.fn().mockResolvedValue(mockResult),
      })

      const topic = "test/topic"

      const { result } = renderHook(() => useQueryJson(topic), {
        wrapper: createWrapper(mockClient, queryClient),
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.data).toEqual(mockResult)
      expect((result.current.data as any)?.payload).toEqual({})
    })

    it("should handle array JSON payload", async () => {
      const mockResult: HttpJsonResult = {
        topic: "test/topic",
        payload: [1, 2, 3, { nested: "value" }],
        timestamp: new Date().toISOString(),
      }

      const mockClient = createMockHttpClient({
        queryJson: jest.fn().mockResolvedValue(mockResult),
      })

      const topic = "test/topic"

      const { result } = renderHook(() => useQueryJson(topic), {
        wrapper: createWrapper(mockClient, queryClient),
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.data).toEqual(mockResult)
      expect(Array.isArray(result.current.data?.payload)).toBe(true)
    })

    it("should handle concurrent JSON queries with same topic", async () => {
      const mockResult: HttpJsonResult = {
        topic: "test/topic",
        payload: { message: "hello" },
        timestamp: new Date().toISOString(),
      }

      const mockClient = createMockHttpClient({
        queryJson: jest.fn().mockResolvedValue(mockResult),
      })

      const topic = "test/topic"

      // Create two hooks with same topic
      const { result: result1 } = renderHook(() => useQueryJson(topic), {
        wrapper: createWrapper(mockClient, queryClient),
      })

      const { result: result2 } = renderHook(() => useQueryJson(topic), {
        wrapper: createWrapper(mockClient, queryClient),
      })

      await waitFor(() => {
        expect(result1.current.isSuccess).toBe(true)
        expect(result2.current.isSuccess).toBe(true)
      })

      // TanStack Query should deduplicate the requests
      expect(mockClient.queryJson).toHaveBeenCalledTimes(1)
      expect(result1.current.data).toEqual(mockResult)
      expect(result2.current.data).toEqual(mockResult)
    })

    it("should handle topics with special characters", async () => {
      const mockResult: HttpJsonResult = {
        topic: "test/topic-with_special.chars",
        payload: { valid: true },
        timestamp: new Date().toISOString(),
      }

      const mockClient = createMockHttpClient({
        queryJson: jest.fn().mockResolvedValue(mockResult),
      })

      const topic = "test/topic-with_special.chars"

      const { result } = renderHook(() => useQueryJson(topic), {
        wrapper: createWrapper(mockClient, queryClient),
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(mockClient.queryJson).toHaveBeenCalledWith(topic)
      expect(result.current.data).toEqual(mockResult)
    })

    it("should handle very long topic names", async () => {
      const longTopic = "test/" + "a".repeat(1000) + "/topic"
      const mockResult: HttpJsonResult = {
        topic: longTopic,
        payload: { valid: true },
        timestamp: new Date().toISOString(),
      }

      const mockClient = createMockHttpClient({
        queryJson: jest.fn().mockResolvedValue(mockResult),
      })

      const { result } = renderHook(() => useQueryJson(longTopic), {
        wrapper: createWrapper(mockClient, queryClient),
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(mockClient.queryJson).toHaveBeenCalledWith(longTopic)
      expect(result.current.data).toEqual(mockResult)
    })
  })
})
