export type ActionResult<TData = void, TError = string> =
  | { status: 'success'; data: TData }
  | { status: 'error'; error: TError };

export type UiActionResult<TData = void, TError = string> =
  | ActionResult<TData, TError>
  | { status: 'idle' };

export function actionSuccess(): ActionResult;
export function actionSuccess<T>(data: T): ActionResult<T>;
export function actionSuccess<T>(data?: T): ActionResult<T | void> {
  return { status: 'success', data };
}

export const actionError = <TData = void>(
  error: string,
): ActionResult<TData> => ({
  status: 'error',
  error,
});
