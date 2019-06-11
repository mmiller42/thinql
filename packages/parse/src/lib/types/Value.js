import _Node, { attributeSetsMap, registerType } from './_Node.js'
import stringify from '../utils/stringify.js'

export default class Value extends _Node {
  static get name() {
    return 'Value'
  }

  constructor({ content, literal }, token) {
    super({ content, literal }, token)
  }

  get content() {
    return attributeSetsMap.get(this).content
  }

  get literal() {
    return attributeSetsMap.get(this).literal
  }

  toString() {
    const { content, literal } = this

    return stringify(content, literal)
  }
}

registerType(Value)
