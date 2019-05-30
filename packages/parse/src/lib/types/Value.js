import './_typedefs.js'
import _Node from './_Node.js'
import { stringify } from '../utils/index.js'

export default class Value extends _Node {
  static get type() {
    return 'Value'
  }

  /**
   * @param {{
   *   content: string,
   *   literal: boolean,
   * }} attributes
   * @param {_Node | _Token} token
   */
  constructor(attributes, token) {
    super(attributes, token)
  }

  toString() {
    const { content, literal } = this.attributes
    return stringify(content, literal)
  }
}
