import * as topping from "@artcom/mqtt-topping"
import React from "react"

const MqttContext = React.createContext()
const MqttProvider = ({ children, mqtt, http }) => {
  const unpublishRecursively = http && mqtt
    ? topping.unpublishRecursively.bind(null, mqtt, http)
    : null

  return (
    <MqttContext.Provider
      value={ { mqtt, http, unpublishRecursively } }>
      { children }
    </MqttContext.Provider>)
}

export { MqttContext, MqttProvider }
