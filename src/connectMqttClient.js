import { connectMqttClient } from "@artcom/mqtt-topping"

export default (wsBrokerUri, appId, deviceId = null) => {
  const clientId = createClientId(appId, deviceId)
  return connectMqttClient(wsBrokerUri, { clientId, keepalive: 5 })
}

function createClientId(appId, deviceId) {
  const uuid = Math.random().toString(16).substr(2, 8)
  return deviceId !== null ? `${appId}-${deviceId}-${uuid}` : `${appId}-${uuid}`
}
