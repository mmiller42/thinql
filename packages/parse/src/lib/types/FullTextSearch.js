import _Node, { attributeSetsMap, registerType } from './_Node.js'

export default class FullTextSearch extends _Node {
  static get name() {
    return 'FullTextSearch'
  }

  constructor({ value }, token) {
    super({ value }, token)
  }

  get value() {
    return attributeSetsMap.get(this).value
  }

  toString() {
    return `${this.value}`
  }
}

registerType(FullTextSearch)
