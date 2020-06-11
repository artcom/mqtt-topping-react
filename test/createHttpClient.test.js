/* eslint-disable import/first */
import { HttpClient } from "@artcom/mqtt-topping"
import { createHttpClient } from "../src"

const uri = "http://broker.test.local"

describe("createHttpClient", () => {
  test("calls internal createHttpClient method", () => {
    const httpClient = createHttpClient(uri)

    expect(httpClient).toBeInstanceOf(HttpClient)
    expect(httpClient.uri).toBe(uri)
  })
})
