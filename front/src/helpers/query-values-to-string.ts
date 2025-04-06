export const valuesToString = (query: Record<string, string | number>): Record<string, string> =>
  Object.keys(query).reduce((acc, key) => ({ ...acc, [key]: query[key].toString() }), {})
