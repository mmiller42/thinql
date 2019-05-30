import './_typedefs.js'
import _LogicalExpression from './_LogicalExpression.js'
import _Node from './_Node.js'
import Call from './Call.js'
import Comparison from './Comparison.js'
import FullTextSearch from './FullTextSearch.js'

export default class Assertion extends _Node {
  static get type() {
    return 'Assertion'
  }

  /**
   * @param {{
   *   assertion: _LogicalExpression | Call | Comparison | FullTextSearch,
   *   negated: boolean,
   * }} attributes
   * @param {_Node | _Token} token
   */
  constructor(attributes, token) {
    super(attributes, token)
  }

  toString() {
    const { assertion, negated } = this.attributes
    const negator = negated ? '!' : ''

    return `${negator}${assertion}`
  }
}
