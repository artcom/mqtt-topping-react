import { useAsyncTask } from "@artcom/async-task-hook"
import { useContext, useCallback } from "react"

import { MqttContext } from "./mqttProvider"

export default ({ topic, depth, flatten, parseJson }) => {
  const { query } = useContext(MqttContext)
  const task = useCallback(
    () => query({ topic, depth, flatten, parseJson }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [topic, depth, flatten, parseJson]
  )

  return useAsyncTask(task)
}
