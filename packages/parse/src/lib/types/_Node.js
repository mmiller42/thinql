import { inspect } from 'util'
import mapValues from '../utils/mapValues.js'
import MemoizedWeakMap from '../utils/MemoizedWeakMap.js'
import Token from '../utils/Token.js'

const types = {}

export const registerType = nodeClass => {
  types[nodeClass.name] = nodeClass
}

export const attributeSetsMap = new MemoizedWeakMap()

const tokensMap = new WeakMap()

export default class _Node {
  static fromJSON(object) {
    if (object && object.$type) {
      const { $type: type, $token: token, ...attributes } = token
      const Type = types[type]

      return new Type(mapValues(attributes, _Node.fromJSON), token)
    } else {
      return object
    }
  }

  constructor(attributes, token = null) {
    for (const key of Object.keys(attributes)) {
      if (attributes[key] === undefined) {
        throw new Error(`attributes[${key}] is undefined`)
      }
    }

    attributeSetsMap.set(this, attributes)

    let _token = token instanceof _Node ? token.$token : token

    if (_token && !(_token instanceof Token)) {
      _token = new Token(_token)
    }

    tokensMap.set(this, _token)
  }

  get $token() {
    return tokensMap.get(this)
  }

  get $type() {
    return this.constructor.name
  }

  [inspect.custom](depth, options) {
    const { $type: type, $token: token } = this

    let displayType = options.stylize(type, 'special')

    if (token) {
      const displayToken = options.stylize(
        `[${token.line}:${token.col}]`
      )

      displayType = `${displayType} ${displayToken}`
    }

    if (depth < 0) {
      return displayType
    }

    const body = inspect(attributeSetsMap.get(this), {
      ...options,
      depth: options.depth == null || options.depth === Infinity
        ? null
        : options.depth - 1
    })

    return `${displayType} ${body}`
  }

  toJSON(options = {}) {
    const { includeTokens = false } = options
    const { $token, $type } = this
    const attributes = attributeSetsMap.get(this)

    const toJson = value => {
      if (value instanceof _Node) {
        return value.toJSON(options)
      } else {
        return value
      }
    }

    const object = {
      $type,
      ...Object.keys(attributes).reduce((result, key) => {
        const value = attributes[key]


        if (Array.isArray(value)) {
          result[key] = value.map(toJson)
        } else {
          result[key] = toJson(value)
        }

        return result
      }, {}),
    }

    if (includeTokens && $token) {
      object.$token = $token
    }

    return object
  }
}
