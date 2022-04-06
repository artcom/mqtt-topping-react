import { useAsyncTask } from "@artcom/async-task-hook"
import { useContext, useCallback } from "react"

import { MqttContext } from "./mqttProvider"

export default (queries) => {
  const { queryBatch } = useContext(MqttContext)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const task = useCallback(() => queryBatch(queries), [queries])
  return useAsyncTask(task)
}
