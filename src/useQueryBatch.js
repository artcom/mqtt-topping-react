
import { useAsyncTask } from "@artcom/async-task-hook"
import { useContext, useCallback } from "react"

import { MqttContext } from "./mqttProvider"

export default queries => {
  const { http } = useContext(MqttContext)
  const task = useCallback(() => http.queryBatch(queries), [queries])
  return useAsyncTask(task)
}

