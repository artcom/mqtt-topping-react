import { useAsyncTask } from "@artcom/async-task-hook";
import { useContext, useCallback } from "react";
import { MqttContext } from "./mqttProvider";
export const useQueryJsonBatch = (topics) => {
    const { queryJsonBatch } = useContext(MqttContext);
    const topicsString = JSON.stringify(topics);
    const task = useCallback(() => {
        if (!queryJsonBatch) {
            return Promise.reject(new Error("useQueryJsonBatch: HttpClient not available in context."));
        }
        const currentTopics = JSON.parse(topicsString);
        return queryJsonBatch(currentTopics);
    }, [queryJsonBatch, topicsString]);
    return useAsyncTask(task);
};
export default useQueryJsonBatch;
//# sourceMappingURL=useQueryJsonBatch.js.map