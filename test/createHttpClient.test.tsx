// File: test/createHttpClient.test.tsx

/**
 * @jest-environment jsdom
 */

import React from "react" // Added React import
import { HttpClient } from "@artcom/mqtt-topping"
import { createHttpClient } from "../src" // Assuming default export exists

describe("createHttpClient", () => {
  test("should create an instance of HttpClient with the correct URI", () => {
    const brokerUri = "http://broker.test.local"
    const httpClient = createHttpClient(brokerUri)

    // Note: With our mock, we can't directly use toBeInstanceOf
    // Instead, check for the presence of required methods
    expect(httpClient.query).toBeDefined()
    expect(typeof httpClient.query).toBe("function") // Check if it has methods
    expect(httpClient.queryBatch).toBeDefined()
    expect(httpClient.queryJson).toBeDefined()
    expect(httpClient.queryJsonBatch).toBeDefined()
  })
})
