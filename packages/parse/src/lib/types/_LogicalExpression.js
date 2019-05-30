import _Node from './_Node.js'

export default class _LogicalExpression extends _Node {
  toString({ brackets = true } = {}) {
    const {
      constructor: { joiner },
      attributes: { assertions },
    } = this

    return `${brackets ? '(' : ''}${assertions.join(joiner)}${brackets ? ')' : ''}`
  }
}
