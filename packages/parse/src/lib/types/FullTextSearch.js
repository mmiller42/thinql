import './_typedefs.js'
import _Node from './_Node.js'
import Value from './Value.js'

export default class FullTextSearch extends _Node {
  static get type() {
    return 'FullTextSearch'
  }

  /**
   * @param {{
   *   value: Value
   * }} attributes
   * @param {_Node | _Token} token
   */
  constructor(attributes, token) {
    super(attributes, token)
  }

  toString() {
    return `${this.attributes.value}`
  }
}
