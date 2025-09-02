import { act, renderHook, waitFor } from "@testing-library/react"

import React from "react"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

import {
  type HttpBatchQueryResult,
  type HttpClient,
  type HttpQuery,
} from "mqtt-topping"

import { MqttProvider } from "../mqttProvider"
import { useQueryBatch } from "../useQueryBatch"

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

describe("useQueryBatch", () => {
  let queryClient: QueryClient

  beforeEach(() => {
    jest.clearAllMocks()
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
          gcTime: 0,
        },
      },
    })
  })

  describe("Basic Batch Query Functionality", () => {
    it("should execute batch query with HttpClient when enabled", async () => {
      const mockResult: HttpBatchQueryResult = {
        results: [
          {
            query: { topic: "test/topic1", depth: 1 },
            result: {
              topics: [{ topic: "test/topic1", payload: "data1" }],
              totalCount: 1,
            },
          },
          {
            query: { topic: "test/topic2", depth: 1 },
            result: {
              topics: [{ topic: "test/topic2", payload: "data2" }],
              totalCount: 1,
            },
          },
        ],
        totalQueries: 2,
        successfulQueries: 2,
        failedQueries: 0,
      }

      const mockClient = createMockHttpClient({
        queryBatch: jest.fn().mockResolvedValue(mockResult),
      })

      const queries: HttpQuery[] = [
        { topic: "test/topic1", depth: 1 },
        { topic: "test/topic2", depth: 1 },
      ]

      const { result } = renderHook(() => useQueryBatch(queries), {
        wrapper: createWrapper(mockClient, queryClient),
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(mockClient.queryBatch).toHaveBeenCalledWith(queries)
      expect(result.current.data).toEqual(mockResult)
      expect(result.current.error).toBe(null)
    })

    it("should not execute query when httpClient is not available", async () => {
      const queries: HttpQuery[] = [
        { topic: "test/topic1", depth: 1 },
        { topic: "test/topic2", depth: 1 },
      ]

      const { result } = renderHook(() => useQueryBatch(queries), {
        wrapper: createWrapper(undefined, queryClient),
      })

      // Should not execute query - disabled queries are not loading but may be pending
      expect(result.current.isLoading).toBe(false)
      expect(result.current.isFetching).toBe(false)
      expect(result.current.isError).toBe(false)
      expect(result.current.data).toBeUndefined()
    })

    it("should not execute query when queries array is empty", async () => {
      const mockClient = createMockHttpClient({
        queryBatch: jest.fn().mockResolvedValue({
          results: [],
          totalQueries: 0,
          successfulQueries: 0,
          failedQueries: 0,
        }),
      })

      const { result } = renderHook(() => useQueryBatch([]), {
        wrapper: createWrapper(mockClient, queryClient),
      })

      // Wait a bit to ensure no query happens
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 10))
      })

      expect(mockClient.queryBatch).not.toHaveBeenCalled()
      expect(result.current.isLoading).toBe(false)
      expect(result.current.isFetching).toBe(false)
      expect(result.current.data).toBeUndefined()
    })

    it("should not execute query when enabled is false", async () => {
      const mockClient = createMockHttpClient({
        queryBatch: jest.fn().mockResolvedValue({
          results: [],
          totalQueries: 0,
          successfulQueries: 0,
          failedQueries: 0,
        }),
      })

      const queries: HttpQuery[] = [
        { topic: "test/topic1", depth: 1 },
        { topic: "test/topic2", depth: 1 },
      ]

      const { result } = renderHook(
        () => useQueryBatch(queries, { enabled: false }),
        {
          wrapper: createWrapper(mockClient, queryClient),
        },
      )

      // Wait a bit to ensure no query happens
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 10))
      })

      expect(mockClient.queryBatch).not.toHaveBeenCalled()
      expect(result.current.isLoading).toBe(false)
      expect(result.current.isFetching).toBe(false)
      expect(result.current.data).toBeUndefined()
    })

    it("should handle batch query with various parameters", async () => {
      const mockResult: HttpBatchQueryResult = {
        results: [
          {
            query: { topic: "test/topic1", depth: 1, flatten: true },
            result: {
              topics: [{ topic: "test/topic1", payload: "data1" }],
              totalCount: 1,
            },
          },
          {
            query: { topic: "test/topic2", depth: 2, parseJson: true },
            result: {
              topics: [{ topic: "test/topic2", payload: { nested: "data" } }],
              totalCount: 1,
            },
          },
        ],
        totalQueries: 2,
        successfulQueries: 2,
        failedQueries: 0,
      }

      const mockClient = createMockHttpClient({
        queryBatch: jest.fn().mockResolvedValue(mockResult),
      })

      const queries: HttpQuery[] = [
        { topic: "test/topic1", depth: 1, flatten: true },
        { topic: "test/topic2", depth: 2, parseJson: true },
      ]

      const { result } = renderHook(() => useQueryBatch(queries), {
        wrapper: createWrapper(mockClient, queryClient),
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(mockClient.queryBatch).toHaveBeenCalledWith(queries)
      expect(result.current.data).toEqual(mockResult)
    })

    it("should generate correct query key based on queries array", async () => {
      const mockClient = createMockHttpClient({
        queryBatch: jest.fn().mockResolvedValue({
          results: [],
          totalQueries: 0,
          successfulQueries: 0,
          failedQueries: 0,
        }),
      })

      const queries1: HttpQuery[] = [{ topic: "test/topic1", depth: 1 }]

      const queries2: HttpQuery[] = [{ topic: "test/topic2", depth: 2 }]

      const { result: result1 } = renderHook(() => useQueryBatch(queries1), {
        wrapper: createWrapper(mockClient, queryClient),
      })

      const { result: result2 } = renderHook(() => useQueryBatch(queries2), {
        wrapper: createWrapper(mockClient, queryClient),
      })

      await waitFor(() => {
        expect(result1.current.isSuccess).toBe(true)
        expect(result2.current.isSuccess).toBe(true)
      })

      // Both queries should have been called independently
      expect(mockClient.queryBatch).toHaveBeenCalledTimes(2)
      expect(mockClient.queryBatch).toHaveBeenCalledWith(queries1)
      expect(mockClient.queryBatch).toHaveBeenCalledWith(queries2)
    })
  })

  describe("Error Handling", () => {
    it("should handle batch query errors properly", async () => {
      const queryError = new Error("Batch query failed")
      const mockClient = createMockHttpClient({
        queryBatch: jest.fn().mockRejectedValue(queryError),
      })

      const queries: HttpQuery[] = [
        { topic: "test/topic1", depth: 1 },
        { topic: "test/topic2", depth: 1 },
      ]

      const { result } = renderHook(
        () => useQueryBatch(queries, { retry: false }),
        {
          wrapper: createWrapper(mockClient, queryClient),
        },
      )

      await waitFor(() => {
        expect(result.current.isError).toBe(true)
      })

      // The error is now enhanced with batch context
      expect(result.current.error?.message).toBe(
        "HTTP batch query failed for topics [test/topic1, test/topic2]: Batch query failed",
      )
      expect(result.current.error?.cause).toEqual(queryError)
      expect(result.current.data).toBeUndefined()
    })

    it("should handle missing HttpClient error", async () => {
      const queries: HttpQuery[] = [
        { topic: "test/topic1", depth: 1 },
        { topic: "test/topic2", depth: 1 },
      ]

      const { result } = renderHook(
        () => useQueryBatch(queries, { enabled: true }),
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
        queryBatch: jest.fn().mockImplementation(() => {
          throw new Error(
            "HttpClient not available. Make sure MqttProvider has httpClient prop.",
          )
        }),
      })

      const queries: HttpQuery[] = [
        { topic: "test/topic1", depth: 1 },
        { topic: "test/topic2", depth: 1 },
      ]

      const { result } = renderHook(
        () => useQueryBatch(queries, { retry: false }),
        {
          wrapper: createWrapper(mockClient, queryClient),
        },
      )

      await waitFor(() => {
        expect(result.current.isError).toBe(true)
      })

      expect(result.current.error?.message).toBe(
        "HTTP batch query failed for topics [test/topic1, test/topic2]: HttpClient not available. Make sure MqttProvider has httpClient prop.",
      )
    })

    it("should handle partial failures in batch results", async () => {
      const mockResult: HttpBatchQueryResult = {
        results: [
          {
            query: { topic: "test/topic1", depth: 1 },
            result: {
              topics: [{ topic: "test/topic1", payload: "data1" }],
              totalCount: 1,
            },
          },
          {
            query: { topic: "test/topic2", depth: 1 },
            error: new Error("Individual query failed"),
          },
        ],
        totalQueries: 2,
        successfulQueries: 1,
        failedQueries: 1,
      }

      const mockClient = createMockHttpClient({
        queryBatch: jest.fn().mockResolvedValue(mockResult),
      })

      const queries: HttpQuery[] = [
        { topic: "test/topic1", depth: 1 },
        { topic: "test/topic2", depth: 1 },
      ]

      const { result } = renderHook(() => useQueryBatch(queries), {
        wrapper: createWrapper(mockClient, queryClient),
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.data).toEqual(mockResult)
      expect(result.current.data?.failedQueries).toBe(1)
      expect(result.current.data?.successfulQueries).toBe(1)
    })

    it("should handle network errors", async () => {
      const networkError = new Error("Network error")
      networkError.name = "HttpNetworkError"

      const mockClient = createMockHttpClient({
        queryBatch: jest.fn().mockRejectedValue(networkError),
      })

      const queries: HttpQuery[] = [
        { topic: "test/topic1", depth: 1 },
        { topic: "test/topic2", depth: 1 },
      ]

      const { result } = renderHook(
        () => useQueryBatch(queries, { retry: false }),
        {
          wrapper: createWrapper(mockClient, queryClient),
        },
      )

      await waitFor(() => {
        expect(result.current.isError).toBe(true)
      })

      // The error is now enhanced with batch context
      expect(result.current.error?.message).toBe(
        "HTTP batch query failed for topics [test/topic1, test/topic2]: Network error",
      )
      expect(result.current.error?.name).toBe("HttpNetworkError")
      expect(result.current.error?.cause).toEqual(networkError)
    })
  })

  describe("TanStack Query Integration", () => {
    it("should support TanStack Query options", async () => {
      const mockResult: HttpBatchQueryResult = {
        results: [
          {
            query: { topic: "test/topic1", depth: 1 },
            result: {
              topics: [{ topic: "test/topic1", payload: "data1" }],
              totalCount: 1,
            },
          },
        ],
        totalQueries: 1,
        successfulQueries: 1,
        failedQueries: 0,
      }

      const mockClient = createMockHttpClient({
        queryBatch: jest.fn().mockResolvedValue(mockResult),
      })

      const queries: HttpQuery[] = [{ topic: "test/topic1", depth: 1 }]

      const onSuccess = jest.fn()
      const onError = jest.fn()

      const { result } = renderHook(
        () =>
          useQueryBatch(queries, {
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
      const mockResult: HttpBatchQueryResult = {
        results: [
          {
            query: { topic: "test/topic1", depth: 1 },
            result: {
              topics: [{ topic: "test/topic1", payload: "data1" }],
              totalCount: 1,
            },
          },
          {
            query: { topic: "test/topic2", depth: 1 },
            result: {
              topics: [{ topic: "test/topic2", payload: "data2" }],
              totalCount: 1,
            },
          },
        ],
        totalQueries: 2,
        successfulQueries: 2,
        failedQueries: 0,
      }

      const mockClient = createMockHttpClient({
        queryBatch: jest.fn().mockResolvedValue(mockResult),
      })

      const queries: HttpQuery[] = [
        { topic: "test/topic1", depth: 1 },
        { topic: "test/topic2", depth: 1 },
      ]

      const { result } = renderHook(
        () =>
          useQueryBatch(queries, {
            select: (data: HttpBatchQueryResult) => data.successfulQueries,
          }),
        {
          wrapper: createWrapper(mockClient, queryClient),
        },
      )

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.data).toBe(2) // Transformed data
    })

    it("should handle refetch functionality", async () => {
      const mockResult: HttpBatchQueryResult = {
        results: [
          {
            query: { topic: "test/topic1", depth: 1 },
            result: {
              topics: [{ topic: "test/topic1", payload: "data1" }],
              totalCount: 1,
            },
          },
        ],
        totalQueries: 1,
        successfulQueries: 1,
        failedQueries: 0,
      }

      const mockClient = createMockHttpClient({
        queryBatch: jest.fn().mockResolvedValue(mockResult),
      })

      const queries: HttpQuery[] = [{ topic: "test/topic1", depth: 1 }]

      const { result } = renderHook(() => useQueryBatch(queries), {
        wrapper: createWrapper(mockClient, queryClient),
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(mockClient.queryBatch).toHaveBeenCalledTimes(1)

      // Trigger refetch
      await act(async () => {
        await result.current.refetch()
      })

      expect(mockClient.queryBatch).toHaveBeenCalledTimes(2)
    })

    it("should handle query invalidation", async () => {
      const mockResult: HttpBatchQueryResult = {
        results: [
          {
            query: { topic: "test/topic1", depth: 1 },
            result: {
              topics: [{ topic: "test/topic1", payload: "data1" }],
              totalCount: 1,
            },
          },
        ],
        totalQueries: 1,
        successfulQueries: 1,
        failedQueries: 0,
      }

      const mockClient = createMockHttpClient({
        queryBatch: jest.fn().mockResolvedValue(mockResult),
      })

      const queries: HttpQuery[] = [{ topic: "test/topic1", depth: 1 }]

      const { result } = renderHook(() => useQueryBatch(queries), {
        wrapper: createWrapper(mockClient, queryClient),
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(mockClient.queryBatch).toHaveBeenCalledTimes(1)

      // Invalidate query
      await act(async () => {
        await queryClient.invalidateQueries({
          queryKey: ["mqtt-http-query-batch", JSON.stringify(queries)],
        })
      })

      await waitFor(() => {
        expect(mockClient.queryBatch).toHaveBeenCalledTimes(2)
      })
    })
  })

  describe("Query State Management", () => {
    it("should show loading state during batch query execution", async () => {
      let resolveQuery: (value: HttpBatchQueryResult) => void
      const queryPromise = new Promise<HttpBatchQueryResult>((resolve) => {
        resolveQuery = resolve
      })

      const mockClient = createMockHttpClient({
        queryBatch: jest.fn().mockReturnValue(queryPromise),
      })

      const queries: HttpQuery[] = [
        { topic: "test/topic1", depth: 1 },
        { topic: "test/topic2", depth: 1 },
      ]

      const { result } = renderHook(() => useQueryBatch(queries), {
        wrapper: createWrapper(mockClient, queryClient),
      })

      // Should be loading initially
      expect(result.current.isPending).toBe(true)
      expect(result.current.isSuccess).toBe(false)
      expect(result.current.isError).toBe(false)

      // Resolve the query
      const mockResult: HttpBatchQueryResult = {
        results: [
          {
            query: { topic: "test/topic1", depth: 1 },
            result: {
              topics: [{ topic: "test/topic1", payload: "data1" }],
              totalCount: 1,
            },
          },
          {
            query: { topic: "test/topic2", depth: 1 },
            result: {
              topics: [{ topic: "test/topic2", payload: "data2" }],
              totalCount: 1,
            },
          },
        ],
        totalQueries: 2,
        successfulQueries: 2,
        failedQueries: 0,
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

    it("should handle queries array changes", async () => {
      const mockResult1: HttpBatchQueryResult = {
        results: [
          {
            query: { topic: "test/topic1", depth: 1 },
            result: {
              topics: [{ topic: "test/topic1", payload: "data1" }],
              totalCount: 1,
            },
          },
        ],
        totalQueries: 1,
        successfulQueries: 1,
        failedQueries: 0,
      }

      const mockResult2: HttpBatchQueryResult = {
        results: [
          {
            query: { topic: "test/topic2", depth: 1 },
            result: {
              topics: [{ topic: "test/topic2", payload: "data2" }],
              totalCount: 1,
            },
          },
        ],
        totalQueries: 1,
        successfulQueries: 1,
        failedQueries: 0,
      }

      const mockClient = createMockHttpClient({
        queryBatch: jest
          .fn()
          .mockResolvedValueOnce(mockResult1)
          .mockResolvedValueOnce(mockResult2),
      })

      const { result, rerender } = renderHook(
        ({ queries }) => useQueryBatch(queries),
        {
          wrapper: createWrapper(mockClient, queryClient),
          initialProps: {
            queries: [{ topic: "test/topic1", depth: 1 }] as HttpQuery[],
          },
        },
      )

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.data).toEqual(mockResult1)

      // Change queries array
      rerender({ queries: [{ topic: "test/topic2", depth: 1 }] as HttpQuery[] })

      await waitFor(() => {
        expect(result.current.data).toEqual(mockResult2)
      })

      expect(mockClient.queryBatch).toHaveBeenCalledTimes(2)
      expect(mockClient.queryBatch).toHaveBeenNthCalledWith(1, [
        { topic: "test/topic1", depth: 1 },
      ])
      expect(mockClient.queryBatch).toHaveBeenNthCalledWith(2, [
        { topic: "test/topic2", depth: 1 },
      ])
    })

    it("should handle enabled state changes", async () => {
      const mockResult: HttpBatchQueryResult = {
        results: [
          {
            query: { topic: "test/topic1", depth: 1 },
            result: {
              topics: [{ topic: "test/topic1", payload: "data1" }],
              totalCount: 1,
            },
          },
        ],
        totalQueries: 1,
        successfulQueries: 1,
        failedQueries: 0,
      }

      const mockClient = createMockHttpClient({
        queryBatch: jest.fn().mockResolvedValue(mockResult),
      })

      const queries: HttpQuery[] = [{ topic: "test/topic1", depth: 1 }]

      const { result, rerender } = renderHook(
        ({ enabled }) => useQueryBatch(queries, { enabled }),
        {
          wrapper: createWrapper(mockClient, queryClient),
          initialProps: { enabled: false },
        },
      )

      // Initially disabled - should not be loading but may be pending
      expect(result.current.isLoading).toBe(false)
      expect(result.current.isFetching).toBe(false)
      expect(mockClient.queryBatch).not.toHaveBeenCalled()

      // Enable query
      rerender({ enabled: true })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(mockClient.queryBatch).toHaveBeenCalledTimes(1)
      expect(result.current.data).toEqual(mockResult)
    })
  })

  describe("Edge Cases", () => {
    it("should handle empty batch query results", async () => {
      const mockResult: HttpBatchQueryResult = {
        results: [],
        totalQueries: 0,
        successfulQueries: 0,
        failedQueries: 0,
      }

      const mockClient = createMockHttpClient({
        queryBatch: jest.fn().mockResolvedValue(mockResult),
      })

      const queries: HttpQuery[] = [{ topic: "nonexistent/topic", depth: 1 }]

      const { result } = renderHook(() => useQueryBatch(queries), {
        wrapper: createWrapper(mockClient, queryClient),
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.data).toEqual(mockResult)
      expect(result.current.data?.results).toHaveLength(0)
    })

    it("should handle single query in batch", async () => {
      const mockResult: HttpBatchQueryResult = {
        results: [
          {
            query: { topic: "test/topic1", depth: 1 },
            result: {
              topics: [{ topic: "test/topic1", payload: "data1" }],
              totalCount: 1,
            },
          },
        ],
        totalQueries: 1,
        successfulQueries: 1,
        failedQueries: 0,
      }

      const mockClient = createMockHttpClient({
        queryBatch: jest.fn().mockResolvedValue(mockResult),
      })

      const queries: HttpQuery[] = [{ topic: "test/topic1", depth: 1 }]

      const { result } = renderHook(() => useQueryBatch(queries), {
        wrapper: createWrapper(mockClient, queryClient),
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(mockClient.queryBatch).toHaveBeenCalledWith(queries)
      expect(result.current.data).toEqual(mockResult)
    })

    it("should handle large batch queries", async () => {
      const queries: HttpQuery[] = Array.from({ length: 10 }, (_, i) => ({
        topic: `test/topic${i}`,
        depth: 1,
      }))

      const mockResult: HttpBatchQueryResult = {
        results: queries.map((query, i) => ({
          query,
          result: {
            topics: [{ topic: `test/topic${i}`, payload: `data${i}` }],
            totalCount: 1,
          },
        })),
        totalQueries: 10,
        successfulQueries: 10,
        failedQueries: 0,
      }

      const mockClient = createMockHttpClient({
        queryBatch: jest.fn().mockResolvedValue(mockResult),
      })

      const { result } = renderHook(() => useQueryBatch(queries), {
        wrapper: createWrapper(mockClient, queryClient),
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(mockClient.queryBatch).toHaveBeenCalledWith(queries)
      expect(result.current.data).toEqual(mockResult)
      expect(result.current.data?.results).toHaveLength(10)
    })

    it("should handle concurrent batch queries with same parameters", async () => {
      const mockResult: HttpBatchQueryResult = {
        results: [
          {
            query: { topic: "test/topic1", depth: 1 },
            result: {
              topics: [{ topic: "test/topic1", payload: "data1" }],
              totalCount: 1,
            },
          },
        ],
        totalQueries: 1,
        successfulQueries: 1,
        failedQueries: 0,
      }

      const mockClient = createMockHttpClient({
        queryBatch: jest.fn().mockResolvedValue(mockResult),
      })

      const queries: HttpQuery[] = [{ topic: "test/topic1", depth: 1 }]

      // Create two hooks with same queries
      const { result: result1 } = renderHook(() => useQueryBatch(queries), {
        wrapper: createWrapper(mockClient, queryClient),
      })

      const { result: result2 } = renderHook(() => useQueryBatch(queries), {
        wrapper: createWrapper(mockClient, queryClient),
      })

      await waitFor(() => {
        expect(result1.current.isSuccess).toBe(true)
        expect(result2.current.isSuccess).toBe(true)
      })

      // TanStack Query should deduplicate the requests
      expect(mockClient.queryBatch).toHaveBeenCalledTimes(1)
      expect(result1.current.data).toEqual(mockResult)
      expect(result2.current.data).toEqual(mockResult)
    })

    it("should handle queries with mixed success and failure", async () => {
      const mockResult: HttpBatchQueryResult = {
        results: [
          {
            query: { topic: "test/topic1", depth: 1 },
            result: {
              topics: [{ topic: "test/topic1", payload: "data1" }],
              totalCount: 1,
            },
          },
          {
            query: { topic: "test/topic2", depth: 1 },
            error: new Error("Topic not found"),
          },
          {
            query: { topic: "test/topic3", depth: 1 },
            result: {
              topics: [{ topic: "test/topic3", payload: "data3" }],
              totalCount: 1,
            },
          },
        ],
        totalQueries: 3,
        successfulQueries: 2,
        failedQueries: 1,
      }

      const mockClient = createMockHttpClient({
        queryBatch: jest.fn().mockResolvedValue(mockResult),
      })

      const queries: HttpQuery[] = [
        { topic: "test/topic1", depth: 1 },
        { topic: "test/topic2", depth: 1 },
        { topic: "test/topic3", depth: 1 },
      ]

      const { result } = renderHook(() => useQueryBatch(queries), {
        wrapper: createWrapper(mockClient, queryClient),
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.data).toEqual(mockResult)
      expect(result.current.data?.successfulQueries).toBe(2)
      expect(result.current.data?.failedQueries).toBe(1)

      // Check individual results
      const results = result.current.data?.results || []
      expect(results[0]).toHaveProperty("result")
      expect(results[1]).toHaveProperty("error")
      expect(results[2]).toHaveProperty("result")
    })
  })
})
