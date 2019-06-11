import _Node, { attributeSetsMap, registerType } from './_Node.js'

export default class Assertion extends _Node {
  static get name() {
    return 'Assertion'
  }

  constructor({ assertion, negated = false }, token) {
    super({ assertion, negated }, token)
  }

  get assertion() {
    return attributeSetsMap.get(this).assertion
  }

  get negated() {
    return attributeSetsMap.get(this).negated
  }

  toString() {
    const { assertion, negated } = this
    const negator = negated ? '!' : ''

    return `${negator}${assertion}`
  }
}

registerType(Assertion)
