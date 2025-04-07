import { useAsyncTask } from "@artcom/async-task-hook"
import { useContext, useCallback, useMemo } from "react"
import type { HttpQuery, HttpBatchQueryResult, HttpError } from "@artcom/mqtt-topping"
import { MqttContext } from "./mqttProvider"

export const useQueryBatch = (queries: HttpQuery[]) => {
  const { queryBatch } = useContext(MqttContext)

  const queriesString = JSON.stringify(queries)

  const task = useCallback(() => {
    if (!queryBatch) {
      return Promise.reject(new Error("useQueryBatch: HttpClient not available in context."))
    }
    const currentQueries = JSON.parse(queriesString)
    return queryBatch(currentQueries)
  }, [queryBatch, queriesString])

  return useAsyncTask<HttpBatchQueryResult, HttpError>(task)
}

export default useQueryBatch
