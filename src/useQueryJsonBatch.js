import { useAsyncTask } from "@artcom/async-task-hook"
import { useContext, useCallback } from "react"

import { MqttContext } from "./mqttProvider"

export default (topics) => {
  const { queryJsonBatch } = useContext(MqttContext)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const task = useCallback(() => queryJsonBatch(topics), [topics])
  return useAsyncTask(task)
}
