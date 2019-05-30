import './_typedefs.js'
import _Node from './_Node.js'
import { stringify } from '../utils/index.js'

export default class Property extends _Node {
  static get type() {
    return 'Property'
  }

  /**
   * @param {{
   *   content: string
   * }} attributes
   * @param {_Node | _Token} token
   */
  constructor(attributes, token) {
    super(attributes, token)
  }

  toString() {
    return stringify(this.attributes.content)
  }
}
