import { connectMqttClient } from "@artcom/mqtt-topping"

export default (wsBrokerUri, serviceId, device = null) => {
  const clientId = createClientId(serviceId, device)
  return connectMqttClient(wsBrokerUri, { clientId, keepalive: 5 })
}

function createClientId(serviceId, device) {
  const uuid = Math.random().toString(16).substr(2, 8)
  return device !== null ? `${serviceId}-${device}-${uuid}` : `${serviceId}-${uuid}`
}
