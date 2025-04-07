import { HttpClient } from "@artcom/mqtt-topping"

export const createHttpClient = (httpBrokerUri: string): HttpClient => {
  return new HttpClient(httpBrokerUri)
}

export default createHttpClient
