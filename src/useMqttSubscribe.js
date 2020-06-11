import { useContext, useEffect } from "react"

import { MqttContext } from "./mqttProvider"

export default (topic, handler, { qos, parseJson } = {}) => {
  const { mqtt } = useContext(MqttContext)

  useEffect(() => {
    mqtt.subscribe(topic, handler, { qos, parseJson })

    return () => mqtt.unsubscribe(topic, handler)
  }, [topic, handler, qos, parseJson])
}
