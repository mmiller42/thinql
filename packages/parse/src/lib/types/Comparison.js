import './_typedefs.js'
import _Node from './_Node.js'
import Call from './Call.js'
import Property from './Property.js'
import Value from './Value.js'

export default class Comparison extends _Node {
  static get type() {
    return 'Comparison'
  }

  /**
   * @param {{
   *   comparisonOperator: '!=' | '*=' | '>=' | '<=' | '>' | '<' | '=',
   *   left: Call | Property,
   *   right: Call | Value,
   * }} attributes
   * @param {_Node | _Token} token
   */
  constructor(attributes, token) {
    super(attributes, token)
  }

  toString() {
    const { comparisonOperator, left, right } = this.attributes

    return `${left} ${comparisonOperator} ${right}`
  }
}
