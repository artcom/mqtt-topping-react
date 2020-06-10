import React from "react"

const MqttContext = React.createContext()
const MqttProvider = ({ children, mqtt }) =>
  <MqttContext.Provider value={ mqtt }>
    { children }
  </MqttContext.Provider>

export { MqttContext, MqttProvider }
