export const objectToParams = (params: Record<string, string | number | boolean>): string => {
  const newParams: Record<string, string> = {}
  for (const key in params) {
    newParams[key] = params[key].toString()
  }
  return new URLSearchParams(newParams).toString()
}
