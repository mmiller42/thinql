import Builder from '../Builder.js'
import processors from './index.js'

const processStatement = (statement, builder, options) => {
  const { expression } = statement
  const { $type: type } = expression

  if (type === Builder.AND || type === Builder.OR) {
    builder.logicalOperator =
      type === Builder.AND ? Builder.AND : Builder.OR
  }

  const process = processors[type]

  process(expression, builder, options)
}

export default processStatement
