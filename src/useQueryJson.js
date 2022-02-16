import { useAsyncTask } from "@artcom/async-task-hook"
import { useContext, useCallback } from "react"

import { MqttContext } from "./mqttProvider"

export default (topic) => {
  const { queryJson } = useContext(MqttContext)
  const task = useCallback(() => queryJson(topic), [topic])
  return useAsyncTask(task)
}
