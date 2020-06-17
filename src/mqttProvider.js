import * as topping from "@artcom/mqtt-topping"
import React from "react"

const MqttContext = React.createContext()
const MqttProvider = ({ children, mqttClient, httpClient }) => {
  const context = { mqttClient, httpClient }

  if (mqttClient) {
    context.publish = mqttClient.publish.bind(mqttClient)
    context.unpublish = mqttClient.unpublish.bind(mqttClient)
    context.subscribe = mqttClient.subscribe.bind(mqttClient)
    context.unsubscribe = mqttClient.unsubscribe.bind(mqttClient)
  }

  if (httpClient) {
    context.query = httpClient.query.bind(httpClient)
    context.queryBatch = httpClient.queryBatch.bind(httpClient)
    context.queryJson = httpClient.queryJson.bind(httpClient)
    context.queryJsonBatch = httpClient.queryJsonBatch.bind(httpClient)
  }

  if (mqttClient && httpClient) {
    context.unpublishRecursively = topping.unpublishRecursively.bind(null, mqttClient, httpClient)
  }

  return (
    <MqttContext.Provider
      value={ context }>
      { children }
    </MqttContext.Provider>)
}

export { MqttContext, MqttProvider }
