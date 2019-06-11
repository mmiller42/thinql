const prepareKnexBuilder = (builder, negate = false) => {
  const { logicalOperator } = builder
  let { knexBuilder } = builder

  if (negate) {
    knexBuilder = knexBuilder._not(true)
  }

  if (logicalOperator) {
    knexBuilder = knexBuilder._bool(logicalOperator === Builder.AND ? 'and' : 'or')
  }

  return knexBuilder
}

export default class Builder {
  static get AND() {
    return 'LogicalAndExpression'
  }

  static get OR() {
    return 'LogicalOrExpression'
  }

  constructor(knexBuilder, logicalOperator = null) {
    this.initial = true
    this.knexBuilder = knexBuilder
    this.logicalOperator = logicalOperator
  }

  addClause(...args) {
    this.knexBuilder = prepareKnexBuilder(this).where(...args)
  }

  addGroup(fn, negate = false, logicalOperator = null) {
    this.knexBuilder = prepareKnexBuilder(this, negate).where(function () {
      const knexBuilder = this
      const builder = new Builder(knexBuilder, logicalOperator)

      fn(builder)

      return knexBuilder
    })
  }
}
