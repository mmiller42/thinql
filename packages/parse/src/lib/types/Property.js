import _Node, { attributeSetsMap, registerType } from './_Node.js'
import stringify from '../utils/stringify.js'

export default class Property extends _Node {
  static get name() {
    return 'Property'
  }

  constructor({ content }, token) {
    super({ content }, token)
  }

  get content() {
    return attributeSetsMap.get(this).content
  }

  toString() {
    return stringify(this.content)
  }
}

registerType(Property)
