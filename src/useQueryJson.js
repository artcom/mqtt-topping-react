
import { useAsyncTask } from "@artcom/async-task-hook"
import { useContext, useCallback } from "react"

import { MqttContext } from "./mqttProvider"

export default topic => {
  const { http } = useContext(MqttContext)
  const task = useCallback(() => http.queryJson(topic), [topic])
  return useAsyncTask(task)
}
