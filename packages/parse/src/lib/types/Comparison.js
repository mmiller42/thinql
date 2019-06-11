import _Node, { attributeSetsMap, registerType } from './_Node.js'

export default class Comparison extends _Node {
  static get name() {
    return 'Comparison'
  }

  constructor({ comparisonOperator, left, right }, token) {
    super({ comparisonOperator, left, right }, token)
  }

  get comparisonOperator() {
    return attributeSetsMap.get(this).comparisonOperator
  }

  get left() {
    return attributeSetsMap.get(this).left
  }

  get right() {
    return attributeSetsMap.get(this).right
  }

  toString() {
    const { comparisonOperator, left, right } = this

    return `${left} ${comparisonOperator} ${right}`
  }
}

registerType(Comparison)
