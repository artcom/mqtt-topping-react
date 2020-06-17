import { useContext, useEffect } from "react"

import { MqttContext } from "./mqttProvider"

export default (topic, handler, { qos, parseJson } = {}) => {
  const { subscribe, unsubscribe } = useContext(MqttContext)

  useEffect(() => {
    subscribe(topic, handler, { qos, parseJson })

    return () => unsubscribe(topic, handler)
  }, [topic, handler, qos, parseJson])
}
