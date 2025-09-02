import { act, renderHook, waitFor } from "@testing-library/react"

import React from "react"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

import { type HttpClient, type HttpJsonResult } from "mqtt-topping"

import { MqttProvider } from "../mqttProvider"
import { useQueryJsonBatch } from "../useQueryJsonBatch"

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

describe("useQueryJsonBatch", () => {
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

  describe("Basic JSON Batch Query Functionality", () => {
    it("should execute JSON batch query with HttpClient when enabled", async () => {
      const mockResults: Array<HttpJsonResult | Error> = [
        {
          topic: "test/topic1",
          payload: { message: "hello1", count: 1 },
          timestamp: new Date().toISOString(),
        },
        {
          topic: "test/topic2",
          payload: { message: "hello2", count: 2 },
          timestamp: new Date().toISOString(),
        },
      ]

      const mockClient = createMockHttpClient({
        queryJson: jest
          .fn()
          .mockResolvedValueOnce(mockResults[0])
          .mockResolvedValueOnce(mockResults[1]),
      })

      const topics = ["test/topic1", "test/topic2"]

      const { result } = renderHook(() => useQueryJsonBatch(topics), {
        wrapper: createWrapper(mockClient, queryClient),
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(mockClient.queryJson).toHaveBeenCalledTimes(2)
      expect(mockClient.queryJson).toHaveBeenCalledWith("test/topic1")
      expect(mockClient.queryJson).toHaveBeenCalledWith("test/topic2")
      expect(result.current.data).toEqual(mockResults)
      expect(result.current.error).toBe(null)
    })

    it("should not execute query when httpClient is not available", async () => {
      const topics = ["test/topic1", "test/topic2"]

      const { result } = renderHook(() => useQueryJsonBatch(topics), {
        wrapper: createWrapper(undefined, queryClient),
      })

      // Should not execute query - disabled queries are not loading but may be pending
      expect(result.current.isLoading).toBe(false)
      expect(result.current.isFetching).toBe(false)
      expect(result.current.isError).toBe(false)
      expect(result.current.data).toBeUndefined()
    })

    it("should not execute query when topics array is empty", async () => {
      const mockClient = createMockHttpClient({
        queryJson: jest.fn(),
      })

      const { result } = renderHook(() => useQueryJsonBatch([]), {
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
        queryJson: jest.fn(),
      })

      const topics = ["test/topic1", "test/topic2"]

      const { result } = renderHook(
        () => useQueryJsonBatch(topics, { enabled: false }),
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

    it("should handle single topic in batch", async () => {
      const mockResult: HttpJsonResult = {
        topic: "test/topic1",
        payload: { message: "hello1" },
        timestamp: new Date().toISOString(),
      }

      const mockClient = createMockHttpClient({
        queryJson: jest.fn().mockResolvedValue(mockResult),
      })

      const topics = ["test/topic1"]

      const { result } = renderHook(() => useQueryJsonBatch(topics), {
        wrapper: createWrapper(mockClient, queryClient),
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(mockClient.queryJson).toHaveBeenCalledTimes(1)
      expect(mockClient.queryJson).toHaveBeenCalledWith("test/topic1")
      expect(result.current.data).toEqual([mockResult])
    })

    it("should generate correct query key based on topics array", async () => {
      const mockClient = createMockHttpClient({
        queryJson: jest
          .fn()
          .mockResolvedValue({ topic: "test", payload: null }),
      })

      const topics1 = ["test/topic1"]
      const topics2 = ["test/topic2"]

      const { result: result1 } = renderHook(() => useQueryJsonBatch(topics1), {
        wrapper: createWrapper(mockClient, queryClient),
      })

      const { result: result2 } = renderHook(() => useQueryJsonBatch(topics2), {
        wrapper: createWrapper(mockClient, queryClient),
      })

      await waitFor(() => {
        expect(result1.current.isSuccess).toBe(true)
        expect(result2.current.isSuccess).toBe(true)
      })

      // Both queries should have been called independently
      expect(mockClient.queryJson).toHaveBeenCalledTimes(2)
      expect(mockClient.queryJson).toHaveBeenCalledWith("test/topic1")
      expect(mockClient.queryJson).toHaveBeenCalledWith("test/topic2")
    })
  })

  describe("Wildcard Validation", () => {
    it("should reject topics with + wildcard", async () => {
      const mockClient = createMockHttpClient({
        queryJson: jest.fn(),
      })

      const topics = ["test/+/topic", "test/valid/topic"]

      const { result } = renderHook(
        () => useQueryJsonBatch(topics, { retry: false }),
        {
          wrapper: createWrapper(mockClient, queryClient),
        },
      )

      await waitFor(() => {
        expect(result.current.isError).toBe(true)
      })

      expect(result.current.error?.message).toContain(
        "Wildcards (+, #) are not supported in useQueryJsonBatch",
      )
      expect(result.current.error?.message).toContain("test/+/topic")
      expect(mockClient.queryJson).not.toHaveBeenCalled()
    })

    it("should reject topics with # wildcard", async () => {
      const mockClient = createMockHttpClient({
        queryJson: jest.fn(),
      })

      const topics = ["test/topic/#", "test/valid/topic"]

      const { result } = renderHook(
        () => useQueryJsonBatch(topics, { retry: false }),
        {
          wrapper: createWrapper(mockClient, queryClient),
        },
      )

      await waitFor(() => {
        expect(result.current.isError).toBe(true)
      })

      expect(result.current.error?.message).toContain(
        "Wildcards (+, #) are not supported in useQueryJsonBatch",
      )
      expect(result.current.error?.message).toContain("test/topic/#")
      expect(mockClient.queryJson).not.toHaveBeenCalled()
    })

    it("should reject multiple topics with wildcards", async () => {
      const mockClient = createMockHttpClient({
        queryJson: jest.fn(),
      })

      const topics = ["test/+/topic", "test/topic/#", "test/valid/topic"]

      const { result } = renderHook(
        () => useQueryJsonBatch(topics, { retry: false }),
        {
          wrapper: createWrapper(mockClient, queryClient),
        },
      )

      await waitFor(() => {
        expect(result.current.isError).toBe(true)
      })

      expect(result.current.error?.message).toContain(
        "Wildcards (+, #) are not supported in useQueryJsonBatch",
      )
      expect(result.current.error?.message).toContain(
        "test/+/topic, test/topic/#",
      )
      expect(mockClient.queryJson).not.toHaveBeenCalled()
    })

    it("should accept topics without wildcards", async () => {
      const mockResults: HttpJsonResult[] = [
        {
          topic: "test/valid/topic1",
          payload: { valid: true },
          timestamp: new Date().toISOString(),
        },
        {
          topic: "test/valid/topic2",
          payload: { valid: true },
          timestamp: new Date().toISOString(),
        },
      ]

      const mockClient = createMockHttpClient({
        queryJson: jest
          .fn()
          .mockResolvedValueOnce(mockResults[0])
          .mockResolvedValueOnce(mockResults[1]),
      })

      const topics = ["test/valid/topic1", "test/valid/topic2"]

      const { result } = renderHook(() => useQueryJsonBatch(topics), {
        wrapper: createWrapper(mockClient, queryClient),
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(mockClient.queryJson).toHaveBeenCalledTimes(2)
      expect(result.current.data).toEqual(mockResults)
    })
  })

  describe("Error Handling", () => {
    it("should handle individual query failures in batch", async () => {
      const mockResult1: HttpJsonResult = {
        topic: "test/topic1",
        payload: { message: "hello1" },
        timestamp: new Date().toISOString(),
      }

      const queryError = new Error("Query failed for topic2")

      const mockClient = createMockHttpClient({
        queryJson: jest
          .fn()
          .mockResolvedValueOnce(mockResult1)
          .mockRejectedValueOnce(queryError),
      })

      const topics = ["test/topic1", "test/topic2"]

      const { result } = renderHook(() => useQueryJsonBatch(topics), {
        wrapper: createWrapper(mockClient, queryClient),
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(mockClient.queryJson).toHaveBeenCalledTimes(2)
      expect(result.current.data).toHaveLength(2)
      expect(result.current.data?.[0]).toEqual(mockResult1)
      expect(result.current.data?.[1]).toBeInstanceOf(Error)
      expect((result.current.data?.[1] as Error).message).toContain(
        'Failed to query JSON for topic "test/topic2"',
      )
    })

    it("should handle all queries failing in batch", async () => {
      const queryError1 = new Error("Query failed for topic1")
      const queryError2 = new Error("Query failed for topic2")

      const mockClient = createMockHttpClient({
        queryJson: jest
          .fn()
          .mockRejectedValueOnce(queryError1)
          .mockRejectedValueOnce(queryError2),
      })

      const topics = ["test/topic1", "test/topic2"]

      const { result } = renderHook(() => useQueryJsonBatch(topics), {
        wrapper: createWrapper(mockClient, queryClient),
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(mockClient.queryJson).toHaveBeenCalledTimes(2)
      expect(result.current.data).toHaveLength(2)
      expect(result.current.data?.[0]).toBeInstanceOf(Error)
      expect(result.current.data?.[1]).toBeInstanceOf(Error)
      expect((result.current.data?.[0] as Error).message).toContain(
        'Failed to query JSON for topic "test/topic1"',
      )
      expect((result.current.data?.[1] as Error).message).toContain(
        'Failed to query JSON for topic "test/topic2"',
      )
    })

    it("should handle missing HttpClient error", async () => {
      const topics = ["test/topic1", "test/topic2"]

      const { result } = renderHook(
        () => useQueryJsonBatch(topics, { enabled: true }),
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

    it("should handle HttpClient throwing error during batch query", async () => {
      const mockClient = createMockHttpClient({
        queryJson: jest.fn().mockImplementation(() => {
          throw new Error(
            "HttpClient not available. Make sure MqttProvider has httpClient prop.",
          )
        }),
      })

      const topics = ["test/topic1", "test/topic2"]

      const { result } = renderHook(
        () => useQueryJsonBatch(topics, { retry: false }),
        {
          wrapper: createWrapper(mockClient, queryClient),
        },
      )

      await waitFor(() => {
        expect(result.current.isError).toBe(true)
      })

      expect(result.current.error?.message).toBe(
        "HttpClient not available. Make sure MqttProvider has httpClient prop.",
      )
    })

    it("should handle JSON parsing errors in individual queries", async () => {
      const mockResult1: HttpJsonResult = {
        topic: "test/topic1",
        payload: { message: "hello1" },
        timestamp: new Date().toISOString(),
      }

      const parseError = new Error("Invalid JSON")
      parseError.name = "HttpPayloadParseError"

      const mockClient = createMockHttpClient({
        queryJson: jest
          .fn()
          .mockResolvedValueOnce(mockResult1)
          .mockRejectedValueOnce(parseError),
      })

      const topics = ["test/topic1", "test/topic2"]

      const { result } = renderHook(() => useQueryJsonBatch(topics), {
        wrapper: createWrapper(mockClient, queryClient),
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.data).toHaveLength(2)
      expect(result.current.data?.[0]).toEqual(mockResult1)
      expect(result.current.data?.[1]).toBeInstanceOf(Error)
      expect((result.current.data?.[1] as Error).cause).toEqual(parseError)
    })

    it("should handle network errors in individual queries", async () => {
      const mockResult1: HttpJsonResult = {
        topic: "test/topic1",
        payload: { message: "hello1" },
        timestamp: new Date().toISOString(),
      }

      const networkError = new Error("Network error")
      networkError.name = "HttpNetworkError"

      const mockClient = createMockHttpClient({
        queryJson: jest
          .fn()
          .mockResolvedValueOnce(mockResult1)
          .mockRejectedValueOnce(networkError),
      })

      const topics = ["test/topic1", "test/topic2"]

      const { result } = renderHook(() => useQueryJsonBatch(topics), {
        wrapper: createWrapper(mockClient, queryClient),
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.data).toHaveLength(2)
      expect(result.current.data?.[0]).toEqual(mockResult1)
      expect(result.current.data?.[1]).toBeInstanceOf(Error)
      expect((result.current.data?.[1] as Error).name).toBe("HttpNetworkError")
      expect((result.current.data?.[1] as Error).cause).toEqual(networkError)
    })
  })

  describe("TanStack Query Integration", () => {
    it("should support TanStack Query options", async () => {
      const mockResults: HttpJsonResult[] = [
        {
          topic: "test/topic1",
          payload: { message: "hello1" },
          timestamp: new Date().toISOString(),
        },
      ]

      const mockClient = createMockHttpClient({
        queryJson: jest.fn().mockResolvedValue(mockResults[0]),
      })

      const topics = ["test/topic1"]
      const onSuccess = jest.fn()
      const onError = jest.fn()

      const { result } = renderHook(
        () =>
          useQueryJsonBatch(topics, {
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
      expect(result.current.data).toEqual(mockResults)
      expect(result.current.error).toBeNull()
    })

    it("should support data transformation with select", async () => {
      const mockResults: Array<HttpJsonResult | Error> = [
        {
          topic: "test/topic1",
          payload: { message: "hello1" },
          timestamp: new Date().toISOString(),
        },
        {
          topic: "test/topic2",
          payload: { message: "hello2" },
          timestamp: new Date().toISOString(),
        },
      ]

      const mockClient = createMockHttpClient({
        queryJson: jest
          .fn()
          .mockResolvedValueOnce(mockResults[0])
          .mockResolvedValueOnce(mockResults[1]),
      })

      const topics = ["test/topic1", "test/topic2"]

      const { result } = renderHook(
        () =>
          useQueryJsonBatch(topics, {
            select: (data: Array<HttpJsonResult | Error>) =>
              data.filter(
                (item): item is HttpJsonResult => !(item instanceof Error),
              ).length,
          }),
        {
          wrapper: createWrapper(mockClient, queryClient),
        },
      )

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.data).toBe(2) // Transformed data - count of successful results
    })

    it("should handle refetch functionality", async () => {
      const mockResult: HttpJsonResult = {
        topic: "test/topic1",
        payload: { message: "hello1" },
        timestamp: new Date().toISOString(),
      }

      const mockClient = createMockHttpClient({
        queryJson: jest.fn().mockResolvedValue(mockResult),
      })

      const topics = ["test/topic1"]

      const { result } = renderHook(() => useQueryJsonBatch(topics), {
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
        topic: "test/topic1",
        payload: { message: "hello1" },
        timestamp: new Date().toISOString(),
      }

      const mockClient = createMockHttpClient({
        queryJson: jest.fn().mockResolvedValue(mockResult),
      })

      const topics = ["test/topic1"]

      const { result } = renderHook(() => useQueryJsonBatch(topics), {
        wrapper: createWrapper(mockClient, queryClient),
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(mockClient.queryJson).toHaveBeenCalledTimes(1)

      // Invalidate query
      await act(async () => {
        await queryClient.invalidateQueries({
          queryKey: ["mqtt-http-query-json-batch", JSON.stringify(topics)],
        })
      })

      await waitFor(() => {
        expect(mockClient.queryJson).toHaveBeenCalledTimes(2)
      })
    })
  })

  describe("Query State Management", () => {
    it("should show loading state during JSON batch query execution", async () => {
      let resolveQuery: (value: HttpJsonResult) => void
      const queryPromise = new Promise<HttpJsonResult>((resolve) => {
        resolveQuery = resolve
      })

      const mockClient = createMockHttpClient({
        queryJson: jest.fn().mockReturnValue(queryPromise),
      })

      const topics = ["test/topic1"]

      const { result } = renderHook(() => useQueryJsonBatch(topics), {
        wrapper: createWrapper(mockClient, queryClient),
      })

      // Should be loading initially
      expect(result.current.isPending).toBe(true)
      expect(result.current.isSuccess).toBe(false)
      expect(result.current.isError).toBe(false)

      // Resolve the query
      const mockResult: HttpJsonResult = {
        topic: "test/topic1",
        payload: { message: "hello1" },
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
      expect(result.current.data).toEqual([mockResult])
    })

    it("should handle topics array changes", async () => {
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
        ({ topics }) => useQueryJsonBatch(topics),
        {
          wrapper: createWrapper(mockClient, queryClient),
          initialProps: { topics: ["test/topic1"] },
        },
      )

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.data).toEqual([mockResult1])

      // Change topics array
      rerender({ topics: ["test/topic2"] })

      await waitFor(() => {
        expect(result.current.data).toEqual([mockResult2])
      })

      expect(mockClient.queryJson).toHaveBeenCalledTimes(2)
      expect(mockClient.queryJson).toHaveBeenNthCalledWith(1, "test/topic1")
      expect(mockClient.queryJson).toHaveBeenNthCalledWith(2, "test/topic2")
    })

    it("should handle enabled state changes", async () => {
      const mockResult: HttpJsonResult = {
        topic: "test/topic1",
        payload: { message: "hello1" },
        timestamp: new Date().toISOString(),
      }

      const mockClient = createMockHttpClient({
        queryJson: jest.fn().mockResolvedValue(mockResult),
      })

      const topics = ["test/topic1"]

      const { result, rerender } = renderHook(
        ({ enabled }) => useQueryJsonBatch(topics, { enabled }),
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
      expect(result.current.data).toEqual([mockResult])
    })
  })

  describe("Edge Cases", () => {
    it("should handle large batch of topics", async () => {
      const topics = Array.from({ length: 10 }, (_, i) => `test/topic${i}`)
      const mockResults: HttpJsonResult[] = topics.map((topic, i) => ({
        topic,
        payload: { message: `hello${i}`, count: i },
        timestamp: new Date().toISOString(),
      }))

      const mockClient = createMockHttpClient({
        queryJson: jest.fn().mockImplementation((topic: string) => {
          const index = topics.indexOf(topic)
          return Promise.resolve(mockResults[index])
        }),
      })

      const { result } = renderHook(() => useQueryJsonBatch(topics), {
        wrapper: createWrapper(mockClient, queryClient),
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(mockClient.queryJson).toHaveBeenCalledTimes(10)
      expect(result.current.data).toEqual(mockResults)
      expect(result.current.data).toHaveLength(10)
    })

    it("should handle mixed success and failure results", async () => {
      const mockResult1: HttpJsonResult = {
        topic: "test/topic1",
        payload: { message: "hello1" },
        timestamp: new Date().toISOString(),
      }

      const mockResult3: HttpJsonResult = {
        topic: "test/topic3",
        payload: { message: "hello3" },
        timestamp: new Date().toISOString(),
      }

      const queryError = new Error("Query failed for topic2")

      const mockClient = createMockHttpClient({
        queryJson: jest
          .fn()
          .mockResolvedValueOnce(mockResult1)
          .mockRejectedValueOnce(queryError)
          .mockResolvedValueOnce(mockResult3),
      })

      const topics = ["test/topic1", "test/topic2", "test/topic3"]

      const { result } = renderHook(() => useQueryJsonBatch(topics), {
        wrapper: createWrapper(mockClient, queryClient),
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(mockClient.queryJson).toHaveBeenCalledTimes(3)
      expect(result.current.data).toHaveLength(3)
      expect(result.current.data?.[0]).toEqual(mockResult1)
      expect(result.current.data?.[1]).toBeInstanceOf(Error)
      expect(result.current.data?.[2]).toEqual(mockResult3)
    })

    it("should handle null and empty JSON payloads", async () => {
      const mockResults: HttpJsonResult[] = [
        {
          topic: "test/topic1",
          payload: null,
          timestamp: new Date().toISOString(),
        },
        {
          topic: "test/topic2",
          payload: {},
          timestamp: new Date().toISOString(),
        },
        {
          topic: "test/topic3",
          payload: [],
          timestamp: new Date().toISOString(),
        },
      ]

      const mockClient = createMockHttpClient({
        queryJson: jest
          .fn()
          .mockResolvedValueOnce(mockResults[0])
          .mockResolvedValueOnce(mockResults[1])
          .mockResolvedValueOnce(mockResults[2]),
      })

      const topics = ["test/topic1", "test/topic2", "test/topic3"]

      const { result } = renderHook(() => useQueryJsonBatch(topics), {
        wrapper: createWrapper(mockClient, queryClient),
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.data).toEqual(mockResults)
      expect(result.current.data?.[0]?.payload).toBe(null)
      expect(result.current.data?.[1]?.payload).toEqual({})
      expect(Array.isArray(result.current.data?.[2]?.payload)).toBe(true)
    })

    it("should handle concurrent JSON batch queries with same topics", async () => {
      const mockResult: HttpJsonResult = {
        topic: "test/topic1",
        payload: { message: "hello1" },
        timestamp: new Date().toISOString(),
      }

      const mockClient = createMockHttpClient({
        queryJson: jest.fn().mockResolvedValue(mockResult),
      })

      const topics = ["test/topic1"]

      // Create two hooks with same topics
      const { result: result1 } = renderHook(() => useQueryJsonBatch(topics), {
        wrapper: createWrapper(mockClient, queryClient),
      })

      const { result: result2 } = renderHook(() => useQueryJsonBatch(topics), {
        wrapper: createWrapper(mockClient, queryClient),
      })

      await waitFor(() => {
        expect(result1.current.isSuccess).toBe(true)
        expect(result2.current.isSuccess).toBe(true)
      })

      // TanStack Query should deduplicate the requests
      expect(mockClient.queryJson).toHaveBeenCalledTimes(1)
      expect(result1.current.data).toEqual([mockResult])
      expect(result2.current.data).toEqual([mockResult])
    })

    it("should handle topics with special characters", async () => {
      const topics = ["test/topic-with_special.chars", "test/topic.with.dots"]
      const mockResults: HttpJsonResult[] = topics.map((topic) => ({
        topic,
        payload: { valid: true },
        timestamp: new Date().toISOString(),
      }))

      const mockClient = createMockHttpClient({
        queryJson: jest
          .fn()
          .mockResolvedValueOnce(mockResults[0])
          .mockResolvedValueOnce(mockResults[1]),
      })

      const { result } = renderHook(() => useQueryJsonBatch(topics), {
        wrapper: createWrapper(mockClient, queryClient),
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(mockClient.queryJson).toHaveBeenCalledTimes(2)
      expect(mockClient.queryJson).toHaveBeenCalledWith(topics[0])
      expect(mockClient.queryJson).toHaveBeenCalledWith(topics[1])
      expect(result.current.data).toEqual(mockResults)
    })

    it("should handle duplicate topics in array", async () => {
      const mockResult: HttpJsonResult = {
        topic: "test/topic1",
        payload: { message: "hello1" },
        timestamp: new Date().toISOString(),
      }

      const mockClient = createMockHttpClient({
        queryJson: jest.fn().mockResolvedValue(mockResult),
      })

      const topics = ["test/topic1", "test/topic1", "test/topic1"]

      const { result } = renderHook(() => useQueryJsonBatch(topics), {
        wrapper: createWrapper(mockClient, queryClient),
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      // Should call queryJson for each topic, even duplicates
      expect(mockClient.queryJson).toHaveBeenCalledTimes(3)
      expect(result.current.data).toEqual([mockResult, mockResult, mockResult])
    })
  })
})
