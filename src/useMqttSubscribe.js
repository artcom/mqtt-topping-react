import { useContext, useEffect } from "react"

import { MqttContext } from "./mqttProvider"

export default (topic, handler, { qos, parseJson } = {}) => {
  const mqttConnection = useContext(MqttContext)

  useEffect(() => {
    mqttConnection.subscribe(topic, handler, { qos, parseJson })

    return () => mqttConnection.unsubscribe(topic, handler)
  }, [topic, handler, qos, parseJson])
}
