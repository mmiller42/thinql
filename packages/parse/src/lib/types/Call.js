import './_typedefs.js'
import _Node from './_Node.js'
import Value from './Value.js'

export default class Call extends _Node {
  static get type() {
    return 'Call'
  }

  /**
   * @param {{
   *   arguments: Array<Call | Value>,
   *   callee: string,
   * }} attributes
   * @param {_Node | _Token} token
   */
  constructor(attributes, token) {
    super(attributes, token)
  }

  toString() {
    const { callee, arguments: args } = this.attributes

    return `${callee}(${args.join(' ')})`
  }
}
