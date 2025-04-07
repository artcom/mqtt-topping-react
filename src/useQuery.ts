import { useAsyncTask } from "@artcom/async-task-hook"
import { useCallback, useContext } from "react"
import type { HttpError, HttpQuery, HttpQueryResult } from "@artcom/mqtt-topping"
import { MqttContext } from "./mqttProvider"

type UseQueryArgs = HttpQuery

export const useQuery = ({ topic, depth, flatten, parseJson }: UseQueryArgs) => {
  const { query } = useContext(MqttContext)

  const task = useCallback(() => {
    if (!query) {
      return Promise.reject(new Error("useQuery: HttpClient not available in context."))
    }
    return query({ topic, depth, flatten, parseJson })
  }, [query, topic, depth, flatten, parseJson])

  return useAsyncTask<HttpQueryResult, HttpError>(task)
}

export default useQuery
