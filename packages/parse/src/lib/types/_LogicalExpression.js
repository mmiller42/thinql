import _Node, { attributeSetsMap } from './_Node.js'

export default class _LogicalExpression extends _Node {
  static get leftBracket() {
    return '('
  }

  static get rightBracket() {
    return ')'
  }

  constructor({ assertions }, token) {
    super({ assertions }, token)
  }

  get assertions() {
    return attributeSetsMap.get(this).assertions
  }

  toString({ brackets = true } = {}) {
    const { leftBracket: lb, rightBracket: rb } = _LogicalExpression
    const { assertions, constructor: { joiner } } = this

    return `${brackets ? lb : ''}${assertions.join(joiner)}${brackets ? rb : ''}`
  }
}
