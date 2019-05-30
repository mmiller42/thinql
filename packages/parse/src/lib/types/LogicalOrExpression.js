import './_typedefs.js'
import _LogicalExpression from './_LogicalExpression.js'
import _Node from './_Node.js'
import Assertion from './Assertion.js'

export default class LogicalOrExpression extends _LogicalExpression {
  static get joiner() {
    return ' + '
  }

  static get type() {
    return 'LogicalOrExpression'
  }

  /**
   * @param {{
   *   assertions: Array<Assertion>,
   * }} attributes
   * @param {_Node | _Token} token
   */
  constructor(attributes, token) {
    super(attributes, token)
  }
}
