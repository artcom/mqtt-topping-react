
import { useAsyncTask } from "@artcom/async-task-hook"
import { useContext, useCallback } from "react"

import { MqttContext } from "./mqttProvider"

export default topics => {
  const { http } = useContext(MqttContext)
  const task = useCallback(() => http.queryJsonBatch(topics), [topics])
  return useAsyncTask(task)
}

