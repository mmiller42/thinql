import _LogicalExpression from './_LogicalExpression.js'
import _Node, { attributeSetsMap, registerType } from './_Node.js'

export default class Statement extends _Node {
  static get name() {
    return 'Statement'
  }

  constructor({ expression }, token) {
    super({ expression }, token)
  }

  get expression() {
    return attributeSetsMap.get(this).expression
  }

  toString() {
    const { expression } = this

    let toStringOpts

    if (expression instanceof _LogicalExpression) {
      toStringOpts = { brackets: false }
    }

    return expression.toString(toStringOpts)
  }
}

registerType(Statement)
