
import { useAsyncTask } from "@artcom/async-task-hook"
import { useContext, useCallback } from "react"

import { MqttContext } from "./mqttProvider"

export default ({ topic, depth, flatten, parseJson }) => {
  const { http } = useContext(MqttContext)
  const task = useCallback(
    () => http.query({ topic, depth, flatten, parseJson }),
    [topic, depth, flatten, parseJson]
  )

  return useAsyncTask(task)
}
