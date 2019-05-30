import './_typedefs.js'
import _LogicalExpression from './_LogicalExpression.js'
import _Node from './_Node.js'
import Assertion from './Assertion.js'

export default class Statement extends _Node {
  static get type() {
    return 'Statement'
  }

  /**
   * @param {{
   *   expression: _LogicalExpression | Assertion,
   * }} attributes
   * @param {_Node | _Token} token
   */
  constructor(attributes, token) {
    super(attributes, token)
  }

  toString() {
    const { expression } = this.attributes

    let toStringOpts

    if (expression instanceof _LogicalExpression) {
      toStringOpts = { brackets: false }
    }

    return expression.toString(toStringOpts)
  }
}
