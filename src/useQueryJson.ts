import { useAsyncTask } from "@artcom/async-task-hook"
import { useContext, useCallback } from "react"
import type { HttpJsonResult } from "@artcom/mqtt-topping"
import { MqttContext } from "./mqttProvider"

export const useQueryJson = (topic: string) => {
  const { queryJson } = useContext(MqttContext)

  const task = useCallback(() => {
    if (!queryJson) {
      return Promise.reject(new Error("useQueryJson: HttpClient not available in context."))
    }
    return queryJson(topic)
  }, [queryJson, topic])

  return useAsyncTask(task)
}

export default useQueryJson
