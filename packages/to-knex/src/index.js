import Builder from './Builder.js'
import processStatement from './processors/statement.js'

const toKnex = (statement, options) => function () {
  const knexBuilder = this
  const builder = new Builder(knexBuilder)

  processStatement(statement, builder, options)

  return knexBuilder
}

export { toKnex }

export default toKnex
