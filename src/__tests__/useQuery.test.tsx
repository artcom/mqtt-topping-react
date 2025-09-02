import { act, renderHook, waitFor } from "@testing-library/react"

import React from "react"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

import {
  type HttpClient,
  type HttpQuery,
  type HttpQueryResult,
} from "mqtt-topping"

import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from "@jest/globals"

import { MqttProvider } from "../mqttProvider"
import { useQuery } from "../useQuery"

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

describe("useQuery", () => {
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

  describe("Basic Query Functionality", () => {
    it("should execute query with HttpClient when enabled", async () => {
      const mockResult: HttpQueryResult = {
        topic: "test/topic",
        payload: "test data",
      }

      const mockClient = createMockHttpClient({
        query: jest.fn().mockResolvedValue(mockResult),
      })

      const query: HttpQuery = { topic: "test/topic", depth: 1 }

      const { result } = renderHook(() => useQuery(query), {
        wrapper: createWrapper(mockClient, queryClient),
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(mockClient.query).toHaveBeenCalledWith(query)
      expect(result.current.data).toEqual(mockResult)
      expect(result.current.error).toBe(null)
    })

    it("should not execute query when httpClient is not available", async () => {
      const query: HttpQuery = { topic: "test/topic", depth: 1 }

      const { result } = renderHook(() => useQuery(query), {
        wrapper: createWrapper(undefined, queryClient),
      })

      // Wait for initial render to complete
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 100))
      })

      // Should not execute query - disabled queries are not loading but may be pending
      expect(result.current.isLoading).toBe(false)
      expect(result.current.isFetching).toBe(false)
      expect(result.current.isError).toBe(false)
      expect(result.current.data).toBeUndefined()
    })

    it("should not execute query when enabled is false", async () => {
      const mockClient = createMockHttpClient({
        query: jest
          .fn()
          .mockResolvedValue({ topic: "test/topic", payload: "test data" }),
      })

      const query: HttpQuery = { topic: "test/topic", depth: 1 }

      const { result } = renderHook(() => useQuery(query, { enabled: false }), {
        wrapper: createWrapper(mockClient, queryClient),
      })

      // Wait a bit to ensure no query happens
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 100))
      })

      expect(mockClient.query).not.toHaveBeenCalled()
      expect(result.current.isLoading).toBe(false)
      expect(result.current.isFetching).toBe(false)
      expect(result.current.data).toBeUndefined()
    })

    it("should handle query with various parameters", async () => {
      const mockResult: HttpQueryResult = [
        { topic: "test/topic", payload: { nested: "data" } },
      ]

      const mockClient = createMockHttpClient({
        query: jest.fn().mockResolvedValue(mockResult),
      })

      const query: HttpQuery = {
        topic: "test/topic",
        depth: 2,
        flatten: true,
        parseJson: true,
      }

      const { result } = renderHook(() => useQuery(query), {
        wrapper: createWrapper(mockClient, queryClient),
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(mockClient.query).toHaveBeenCalledWith({
        topic: "test/topic",
        depth: 2,
        flatten: true,
        parseJson: true,
      })
      expect(result.current.data).toEqual(mockResult)
    })

    it("should generate correct query key based on parameters", async () => {
      const mockClient = createMockHttpClient({
        query: jest.fn().mockResolvedValue([]),
      })

      const query1: HttpQuery = { topic: "test/topic1", depth: 1 }
      const query2: HttpQuery = { topic: "test/topic2", depth: 2 }

      const { result: result1 } = renderHook(() => useQuery(query1), {
        wrapper: createWrapper(mockClient, queryClient),
      })

      const { result: result2 } = renderHook(() => useQuery(query2), {
        wrapper: createWrapper(mockClient, queryClient),
      })

      await waitFor(() => {
        expect(result1.current.isSuccess).toBe(true)
        expect(result2.current.isSuccess).toBe(true)
      })

      // Both queries should have been called independently
      expect(mockClient.query).toHaveBeenCalledTimes(2)
      expect(mockClient.query).toHaveBeenCalledWith(query1)
      expect(mockClient.query).toHaveBeenCalledWith(query2)
    })
  })

  describe("Error Handling", () => {
    it("should handle query errors properly", async () => {
      const queryError = new Error("Query failed")
      const mockClient = createMockHttpClient({
        query: jest.fn().mockRejectedValue(queryError),
      })

      const query: HttpQuery = { topic: "test/topic", depth: 1 }

      const { result } = renderHook(() => useQuery(query, { retry: false }), {
        wrapper: createWrapper(mockClient, queryClient),
      })

      await waitFor(() => {
        expect(result.current.isError).toBe(true)
      })

      // The error is now enhanced with topic context
      expect(result.current.error?.message).toBe(
        'HTTP query failed for topic "test/topic": Query failed',
      )
      expect(result.current.error?.cause).toEqual(queryError)
      expect(result.current.data).toBeUndefined()
    })

    it("should handle missing HttpClient error", async () => {
      const query: HttpQuery = { topic: "test/topic", depth: 1 }

      const { result } = renderHook(() => useQuery(query, { enabled: true }), {
        wrapper: createWrapper(undefined, queryClient),
      })

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 100))
      })

      // Query should be disabled when httpClient is not available
      expect(result.current.isLoading).toBe(false)
      expect(result.current.isFetching).toBe(false)
      expect(result.current.isError).toBe(false)
      expect(result.current.data).toBeUndefined()
    })

    it("should handle HttpClient throwing error during query", async () => {
      const mockClient = createMockHttpClient({
        query: jest.fn().mockImplementation(() => {
          throw new Error(
            "HttpClient not available. Make sure MqttProvider has httpClient prop.",
          )
        }),
      })

      const query: HttpQuery = { topic: "test/topic", depth: 1 }

      const { result } = renderHook(() => useQuery(query, { retry: false }), {
        wrapper: createWrapper(mockClient, queryClient),
      })

      await waitFor(() => {
        expect(result.current.isError).toBe(true)
      })

      expect(result.current.error?.message).toBe(
        'HTTP query failed for topic "test/topic": HttpClient not available. Make sure MqttProvider has httpClient prop.',
      )
    })

    it("should handle network errors", async () => {
      const networkError = new Error("Network error")
      networkError.name = "HttpNetworkError"

      const mockClient = createMockHttpClient({
        query: jest.fn().mockRejectedValue(networkError),
      })

      const query: HttpQuery = { topic: "test/topic", depth: 1 }

      const { result } = renderHook(() => useQuery(query, { retry: false }), {
        wrapper: createWrapper(mockClient, queryClient),
      })

      await waitFor(() => {
        expect(result.current.isError).toBe(true)
      })

      // The error is now enhanced with topic context
      expect(result.current.error?.message).toBe(
        'HTTP query failed for topic "test/topic": Network error',
      )
      expect(result.current.error?.name).toBe("HttpNetworkError")
      expect(result.current.error?.cause).toEqual(networkError)
    })
  })

  describe("TanStack Query Integration", () => {
    it("should support TanStack Query options", async () => {
      const mockResult: HttpQueryResult = {
        topic: "test/topic",
        payload: "test data",
      }

      const mockClient = createMockHttpClient({
        query: jest.fn().mockResolvedValue(mockResult),
      })

      const query: HttpQuery = { topic: "test/topic", depth: 1 }

      const { result } = renderHook(
        () =>
          useQuery(query, {
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
      const mockResult: HttpQueryResult = [
        { topic: "test/topic", payload: "test data" },
      ]

      const mockClient = createMockHttpClient({
        query: jest.fn().mockResolvedValue(mockResult),
      })

      const query: HttpQuery = { topic: "test/topic", depth: 1 }

      const { result } = renderHook(
        () =>
          useQuery(query, {
            select: (data: HttpQueryResult) =>
              (Array.isArray(data) ? data.length : 1) as any,
          }),
        {
          wrapper: createWrapper(mockClient, queryClient),
        },
      )

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.data).toBe(1) // Transformed data
    })

    it("should handle refetch functionality", async () => {
      const mockResult: HttpQueryResult = {
        topic: "test/topic",
        payload: "test data",
      }

      const mockClient = createMockHttpClient({
        query: jest.fn().mockResolvedValue(mockResult),
      })

      const query: HttpQuery = { topic: "test/topic", depth: 1 }

      const { result } = renderHook(() => useQuery(query), {
        wrapper: createWrapper(mockClient, queryClient),
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(mockClient.query).toHaveBeenCalledTimes(1)

      // Trigger refetch
      await act(async () => {
        await result.current.refetch()
      })

      expect(mockClient.query).toHaveBeenCalledTimes(2)
    })

    it("should handle query invalidation", async () => {
      const mockResult: HttpQueryResult = {
        topic: "test/topic",
        payload: "test data",
      }

      const mockClient = createMockHttpClient({
        query: jest.fn().mockResolvedValue(mockResult),
      })

      const query: HttpQuery = { topic: "test/topic", depth: 1 }

      const { result } = renderHook(() => useQuery(query), {
        wrapper: createWrapper(mockClient, queryClient),
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(mockClient.query).toHaveBeenCalledTimes(1)

      // Invalidate query
      await act(async () => {
        await queryClient.invalidateQueries({
          queryKey: ["mqtt-http-query", "test/topic", 1, undefined, undefined],
        })
      })

      await waitFor(() => {
        expect(mockClient.query).toHaveBeenCalledTimes(2)
      })
    })
  })

  describe("Query State Management", () => {
    it("should show loading state during query execution", async () => {
      let resolveQuery: (value: HttpQueryResult) => void
      const queryPromise = new Promise<HttpQueryResult>((resolve) => {
        resolveQuery = resolve
      })

      const mockClient = createMockHttpClient({
        query: jest.fn().mockReturnValue(queryPromise),
      })

      const query: HttpQuery = { topic: "test/topic", depth: 1 }

      const { result } = renderHook(() => useQuery(query), {
        wrapper: createWrapper(mockClient, queryClient),
      })

      // Should be loading initially
      expect(result.current.isPending).toBe(true)
      expect(result.current.isSuccess).toBe(false)
      expect(result.current.isError).toBe(false)

      // Resolve the query
      const mockResult: HttpQueryResult = {
        topic: "test/topic",
        payload: "test data",
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

    it("should handle query parameter changes", async () => {
      const mockResult1: HttpQueryResult = {
        topic: "test/topic1",
        payload: "data1",
      }

      const mockResult2: HttpQueryResult = {
        topic: "test/topic2",
        payload: "data2",
      }

      const mockClient = createMockHttpClient({
        query: jest
          .fn()
          .mockResolvedValueOnce(mockResult1)
          .mockResolvedValueOnce(mockResult2),
      })

      const { result, rerender } = renderHook(({ query }) => useQuery(query), {
        wrapper: createWrapper(mockClient, queryClient),
        initialProps: {
          query: { topic: "test/topic1", depth: 1 } as HttpQuery,
        },
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.data).toEqual(mockResult1)

      // Change query parameters
      rerender({ query: { topic: "test/topic2", depth: 1 } as HttpQuery })

      await waitFor(() => {
        expect(result.current.data).toEqual(mockResult2)
      })

      expect(mockClient.query).toHaveBeenCalledTimes(2)
      expect(mockClient.query).toHaveBeenNthCalledWith(1, {
        topic: "test/topic1",
        depth: 1,
      })
      expect(mockClient.query).toHaveBeenNthCalledWith(2, {
        topic: "test/topic2",
        depth: 1,
      })
    })

    it("should handle enabled state changes", async () => {
      const mockResult: HttpQueryResult = {
        topic: "test/topic",
        payload: "test data",
      }

      const mockClient = createMockHttpClient({
        query: jest.fn().mockResolvedValue(mockResult),
      })

      const query: HttpQuery = { topic: "test/topic", depth: 1 }

      const { result, rerender } = renderHook(
        ({ enabled }) => useQuery(query, { enabled }),
        {
          wrapper: createWrapper(mockClient, queryClient),
          initialProps: { enabled: false },
        },
      )

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 100))
      })

      // Initially disabled - should not be loading but may be pending
      expect(result.current.isLoading).toBe(false)
      expect(result.current.isFetching).toBe(false)
      expect(mockClient.query).not.toHaveBeenCalled()

      // Enable query
      rerender({ enabled: true })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(mockClient.query).toHaveBeenCalledTimes(1)
      expect(result.current.data).toEqual(mockResult)
    })
  })

  describe("Edge Cases", () => {
    it("should handle empty query results", async () => {
      const mockResult: HttpQueryResult = []

      const mockClient = createMockHttpClient({
        query: jest.fn().mockResolvedValue(mockResult),
      })

      const query: HttpQuery = { topic: "nonexistent/topic", depth: 1 }

      const { result } = renderHook(() => useQuery(query), {
        wrapper: createWrapper(mockClient, queryClient),
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.data).toEqual(mockResult)
      expect(
        Array.isArray(result.current.data) ? result.current.data : [],
      ).toHaveLength(0)
    })

    it("should handle query with undefined optional parameters", async () => {
      const mockResult: HttpQueryResult = {
        topic: "test/topic",
        payload: "test data",
      }

      const mockClient = createMockHttpClient({
        query: jest.fn().mockResolvedValue(mockResult),
      })

      const query: HttpQuery = {
        topic: "test/topic",
        depth: 1,
        // flatten and parseJson are undefined
      }

      const { result } = renderHook(() => useQuery(query), {
        wrapper: createWrapper(mockClient, queryClient),
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(mockClient.query).toHaveBeenCalledWith({
        topic: "test/topic",
        depth: 1,
      })
    })

    it("should handle concurrent queries with same parameters", async () => {
      const mockResult: HttpQueryResult = {
        topic: "test/topic",
        payload: "test data",
      }

      const mockClient = createMockHttpClient({
        query: jest.fn().mockResolvedValue(mockResult),
      })

      const query: HttpQuery = { topic: "test/topic", depth: 1 }

      // Create two hooks with same query
      const { result: result1 } = renderHook(() => useQuery(query), {
        wrapper: createWrapper(mockClient, queryClient),
      })

      const { result: result2 } = renderHook(() => useQuery(query), {
        wrapper: createWrapper(mockClient, queryClient),
      })

      await waitFor(() => {
        expect(result1.current.isSuccess).toBe(true)
        expect(result2.current.isSuccess).toBe(true)
      })

      // TanStack Query should deduplicate the requests
      expect(mockClient.query).toHaveBeenCalledTimes(1)
      expect(result1.current.data).toEqual(mockResult)
      expect(result2.current.data).toEqual(mockResult)
    })

    it("should handle query client changes", async () => {
      const mockResult: HttpQueryResult = {
        topic: "test/topic",
        payload: "test data",
      }

      const mockClient1 = createMockHttpClient({
        query: jest.fn().mockResolvedValue(mockResult),
      })

      const mockClient2 = createMockHttpClient({
        query: jest.fn().mockResolvedValue(mockResult),
      })

      const query: HttpQuery = { topic: "test/topic", depth: 1 }

      // Test with first client
      const { result: result1 } = renderHook(() => useQuery(query), {
        wrapper: createWrapper(mockClient1, queryClient),
      })

      await waitFor(() => {
        expect(result1.current.isSuccess).toBe(true)
      })

      expect(mockClient1.query).toHaveBeenCalledTimes(1)

      // Test with second client (separate hook instance)
      const { result: result2 } = renderHook(() => useQuery(query), {
        wrapper: createWrapper(mockClient2, queryClient),
      })

      await waitFor(() => {
        expect(result2.current.isSuccess).toBe(true)
      })

      expect(mockClient2.query).toHaveBeenCalledTimes(1)
    })
  })
})
