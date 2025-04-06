export const paramsToObject = (search: string): Record<string, string | number | boolean> => {
  const paramsObject = Object.fromEntries(new URLSearchParams(search))
  const paramsObjectOutput: Record<string, string | number | boolean> = {}
  for (const key in paramsObject) {
    switch (true) {
      case !isNaN(+paramsObject[key]):
        paramsObjectOutput[key] = Number(paramsObject[key])
        break
      case paramsObject[key] === 'true':
        paramsObjectOutput[key] = true
        break
      case paramsObject[key] === 'false':
        paramsObjectOutput[key] = false
        break
      default:
        paramsObjectOutput[key] = paramsObject[key]
    }
  }

  return paramsObjectOutput
}
