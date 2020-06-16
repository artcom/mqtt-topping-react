/* eslint-disable import/first */
import { HttpClient } from "@artcom/mqtt-topping"
import { createHttpClient } from "../src"

describe("createHttpClient", () => {
  test("calls internal createHttpClient method", () => {
    const brokerUri = "http://broker.test.local"

    const httpClient = createHttpClient(brokerUri)

    expect(httpClient).toBeInstanceOf(HttpClient)
    expect(httpClient.uri).toBe(brokerUri)
  })
})
