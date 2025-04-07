declare module "@artcom/async-task-hook" {
  export const RUNNING: "RUNNING"
  export const FINISHED: "FINISHED"
  export const ERROR: "ERROR"

  type TaskStatus = typeof RUNNING | typeof FINISHED | typeof ERROR

  interface AsyncTask<TResult = unknown, TError = Error> {
    status: TaskStatus
    result: TResult | undefined
    error: TError | undefined
    run: () => Promise<TResult>
    cancel?: () => void
    reset?: () => void
  }

  export function useAsyncTask<TResult = unknown, TError = Error>(
    task: () => Promise<TResult>,
    deps?: React.DependencyList,
  ): AsyncTask<TResult, TError>
}
