import { unpublishRecursively } from "@artcom/mqtt-topping"
import React from "react"

const MqttContext = React.createContext()
const MqttProvider = ({ children, mqtt, http }) => {
  const unpublishRecursivelyBind = mqtt && http ? unpublishRecursively.bind(null, mqtt, http) : null

  return (
    <MqttContext.Provider
      value={ { mqtt, http, unpublishRecursively: unpublishRecursivelyBind } }>
      { children }
    </MqttContext.Provider>)
}

export { MqttContext, MqttProvider }
