import { useAsyncTask } from "@artcom/async-task-hook"
import { useContext, useCallback, useMemo } from "react"
import type { HttpJsonResult, HttpError } from "@artcom/mqtt-topping"
import { MqttContext } from "./mqttProvider"

type QueryJsonBatchResult = Array<HttpJsonResult | HttpError>

export const useQueryJsonBatch = (topics: string[]) => {
  const { queryJsonBatch } = useContext(MqttContext)

  const topicsString = JSON.stringify(topics)

  const task = useCallback(() => {
    if (!queryJsonBatch) {
      return Promise.reject(new Error("useQueryJsonBatch: HttpClient not available in context."))
    }
    const currentTopics = JSON.parse(topicsString)
    return queryJsonBatch(currentTopics)
  }, [queryJsonBatch, topicsString])

  return useAsyncTask(task)
}

export default useQueryJsonBatch
