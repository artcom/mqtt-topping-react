import { useCallback, useContext } from "react"

import { MqttContext } from "./mqttProvider"

export default (topic, { qos, stringifyJson, retain } = { }) => {
  const mqttConnection = useContext(MqttContext)

  return useCallback(
    payload => mqttConnection.unpublish(topic, payload, { qos, stringifyJson, retain }),
    [topic, qos, stringifyJson, retain])
}
