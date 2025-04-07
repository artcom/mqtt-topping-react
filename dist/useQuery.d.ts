import type { HttpError, HttpQuery, HttpQueryResult } from "@artcom/mqtt-topping";
type UseQueryArgs = HttpQuery;
export declare const useQuery: ({ topic, depth, flatten, parseJson }: UseQueryArgs) => import("@artcom/async-task-hook").AsyncTask<HttpQueryResult, HttpError>;
export default useQuery;
//# sourceMappingURL=useQuery.d.ts.map