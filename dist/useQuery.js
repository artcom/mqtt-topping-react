import { useAsyncTask } from "@artcom/async-task-hook";
import { useCallback, useContext } from "react";
import { MqttContext } from "./mqttProvider";
export const useQuery = ({ topic, depth, flatten, parseJson }) => {
    const { query } = useContext(MqttContext);
    const task = useCallback(() => {
        if (!query) {
            return Promise.reject(new Error("useQuery: HttpClient not available in context."));
        }
        return query({ topic, depth, flatten, parseJson });
    }, [query, topic, depth, flatten, parseJson]);
    return useAsyncTask(task);
};
export default useQuery;
//# sourceMappingURL=useQuery.js.map