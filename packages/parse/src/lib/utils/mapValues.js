const mapValues = (object, fn) => Object.keys(object).reduce((result, key) => {
  result[key] = fn(object[key], key, object)
  return result
}, {})

export default mapValues
