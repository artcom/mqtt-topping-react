import { useAsyncTask } from "@artcom/async-task-hook";
import { useContext, useCallback } from "react";
import { MqttContext } from "./mqttProvider";
export const useQueryBatch = (queries) => {
    const { queryBatch } = useContext(MqttContext);
    const queriesString = JSON.stringify(queries);
    const task = useCallback(() => {
        if (!queryBatch) {
            return Promise.reject(new Error("useQueryBatch: HttpClient not available in context."));
        }
        const currentQueries = JSON.parse(queriesString);
        return queryBatch(currentQueries);
    }, [queryBatch, queriesString]);
    return useAsyncTask(task);
};
export default useQueryBatch;
//# sourceMappingURL=useQueryBatch.js.map