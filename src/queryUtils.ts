import { QueryClient } from "@tanstack/react-query"
import type { QueryKey } from "@tanstack/react-query"

import type { HttpQuery } from "mqtt-topping"

// Constants for retry configuration
const RETRY_CONSTANTS = {
  MAX_RETRY_ATTEMPTS: 3,
  BASE_DELAY_MS: 1000,
  MAX_DELAY_MS: 30000,
  JITTER_FACTOR: 0.1,
} as const

// Constants for cache configuration
const CACHE_CONSTANTS = {
  DEFAULT_STALE_TIME_MS: 5 * 60 * 1000, // 5 minutes
  DEFAULT_GC_TIME_MS: 10 * 60 * 1000, // 10 minutes
  DEV_STALE_TIME_MS: 30 * 1000, // 30 seconds
  DEV_GC_TIME_MS: 2 * 60 * 1000, // 2 minutes
  PROD_STALE_TIME_MS: 10 * 60 * 1000, // 10 minutes
  PROD_GC_TIME_MS: 30 * 60 * 1000, // 30 minutes
} as const

/**
 * Query key generation utilities for different query types
 */
export const queryKeys = {
  /**
   * Generate query key for single HTTP query
   */
  httpQuery: (query: HttpQuery): QueryKey => [
    "mqtt-http-query",
    query.topic,
    query.depth,
    query.flatten,
    query.parseJson,
  ],

  /**
   * Generate query key for batch HTTP queries
   */
  httpQueryBatch: (queries: HttpQuery[]): QueryKey => [
    "mqtt-http-query-batch",
    JSON.stringify(queries),
  ],

  /**
   * Generate query key for JSON-specific query
   */
  httpQueryJson: (topic: string): QueryKey => ["mqtt-http-query-json", topic],

  /**
   * Generate query key for JSON batch queries
   */
  httpQueryJsonBatch: (topics: string[]): QueryKey => [
    "mqtt-http-query-json-batch",
    JSON.stringify(topics),
  ],

  /**
   * Generate base query key for all MQTT-related queries
   */
  all: (): QueryKey => ["mqtt-topping"],

  /**
   * Generate query key for specific topic queries
   */
  topic: (topic: string): QueryKey => ["mqtt-topping", "topic", topic],
} as const

/**
 * Error handling utilities for TanStack Query integration
 */
export const errorHandling = {
  /**
   * Determine if an error should trigger a retry
   */
  shouldRetry: (failureCount: number, error: Error): boolean => {
    // Don't retry after max attempts
    if (failureCount >= RETRY_CONSTANTS.MAX_RETRY_ATTEMPTS) {
      return false
    }

    // Don't retry on client errors (4xx status codes)
    if (error.name === "HttpRequestError" || error.name === "HttpQueryError") {
      return false
    }

    // Retry on network errors, timeouts, and server errors
    if (
      error.name === "HttpNetworkError" ||
      error.name === "HttpTimeoutError" ||
      error.name === "HttpServerError" ||
      error.name === "HttpProcessingError"
    ) {
      return true
    }

    // Default: retry on unknown errors
    return true
  },

  /**
   * Calculate retry delay with exponential backoff
   */
  retryDelay: (retryAttempt: number): number => {
    // Exponentially increasing delay with cap
    const exponentialDelay = Math.min(
      RETRY_CONSTANTS.BASE_DELAY_MS * Math.pow(2, retryAttempt),
      RETRY_CONSTANTS.MAX_DELAY_MS,
    )

    // Add jitter to prevent thundering herd
    const jitter =
      Math.random() * RETRY_CONSTANTS.JITTER_FACTOR * exponentialDelay

    return exponentialDelay + jitter
  },

  /**
   * Determine if error should be thrown to error boundary
   */
  useErrorBoundary: (error: Error): boolean => {
    // Only throw critical errors to error boundary
    return (
      error.name === "MqttConnectionError" || error.name === "HttpNetworkError"
    )
  },
} as const

/**
 * Retry logic configuration helpers
 */
export const retryConfig = {
  /**
   * Default retry configuration for HTTP queries
   */
  default: {
    retry: errorHandling.shouldRetry,
    retryDelay: errorHandling.retryDelay,
  },

  /**
   * Aggressive retry configuration for critical queries
   */
  aggressive: {
    retry: 5,
    retryDelay: (retryAttempt: number) =>
      Math.min(500 * Math.pow(2, retryAttempt), 10000),
  },

  /**
   * Conservative retry configuration for non-critical queries
   */
  conservative: {
    retry: 1,
    retryDelay: 2000,
  },

  /**
   * No retry configuration for one-time queries
   */
  none: {
    retry: false,
    retryDelay: 0,
  },
} as const

/**
 * QueryClient configuration utilities
 */
export const queryClientConfig = {
  /**
   * Create default QueryClient configuration for MQTT Topping
   */
  createDefault: () => ({
    defaultOptions: {
      queries: {
        // Default stale time
        staleTime: CACHE_CONSTANTS.DEFAULT_STALE_TIME_MS,
        // Default garbage collection time
        gcTime: CACHE_CONSTANTS.DEFAULT_GC_TIME_MS,
        // Retry configuration
        retry: errorHandling.shouldRetry,
        retryDelay: errorHandling.retryDelay,
        // Error boundary configuration
        throwOnError: errorHandling.useErrorBoundary,
        // Refetch configuration
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
        refetchOnMount: true,
      },
      mutations: {
        // Retry mutations once
        retry: 1,
        retryDelay: 1000,
      },
    },
  }),

  /**
   * Create development-optimized QueryClient configuration
   */
  createDevelopment: () => ({
    defaultOptions: {
      queries: {
        // Shorter stale time for development
        staleTime: 30 * 1000,
        // Shorter cache time for development
        gcTime: 2 * 60 * 1000,
        // More aggressive refetching in development
        refetchOnWindowFocus: true,
        refetchOnReconnect: true,
        refetchOnMount: "always" as const,
        // Retry configuration
        retry: errorHandling.shouldRetry,
        retryDelay: errorHandling.retryDelay,
      },
      mutations: {
        retry: 1,
        retryDelay: 500,
      },
    },
  }),

  /**
   * Create production-optimized QueryClient configuration
   */
  createProduction: () => ({
    defaultOptions: {
      queries: {
        // Longer stale time for production
        staleTime: 10 * 60 * 1000,
        // Longer cache time for production
        gcTime: 30 * 60 * 1000,
        // Conservative refetching in production
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
        refetchOnMount: true,
        // Retry configuration
        retry: errorHandling.shouldRetry,
        retryDelay: errorHandling.retryDelay,
        // Error boundary configuration
        throwOnError: errorHandling.useErrorBoundary,
      },
      mutations: {
        retry: 2,
        retryDelay: 2000,
      },
    },
  }),

  /**
   * Create QueryClient instance with specified configuration
   */
  create: (config?: ConstructorParameters<typeof QueryClient>[0]) => {
    return new QueryClient(config || queryClientConfig.createDefault())
  },
} as const

/**
 * Utility functions for query invalidation and cache management
 */
export const cacheUtils = {
  /**
   * Invalidate all MQTT-related queries
   */
  invalidateAll: (queryClient: QueryClient) => {
    return queryClient.invalidateQueries({
      queryKey: queryKeys.all(),
    })
  },

  /**
   * Invalidate queries for a specific topic
   */
  invalidateTopic: (queryClient: QueryClient, topic: string) => {
    return queryClient.invalidateQueries({
      queryKey: queryKeys.topic(topic),
    })
  },

  /**
   * Remove all cached data for MQTT queries
   */
  clearAll: (queryClient: QueryClient) => {
    return queryClient.removeQueries({
      queryKey: queryKeys.all(),
    })
  },

  /**
   * Remove cached data for a specific topic
   */
  clearTopic: (queryClient: QueryClient, topic: string) => {
    return queryClient.removeQueries({
      queryKey: queryKeys.topic(topic),
    })
  },

  /**
   * Prefetch data for a query
   */
  prefetch: async (
    queryClient: QueryClient,
    queryKey: QueryKey,
    queryFn: () => Promise<unknown>,
    options?: { staleTime?: number },
  ) => {
    return queryClient.prefetchQuery({
      queryKey,
      queryFn,
      ...(options?.staleTime !== undefined && { staleTime: options.staleTime }),
    })
  },
} as const
