import processors from './index.js'

const processComparison = (comparison, builder, options) => {
  let { comparisonOperator, left, right } = comparison

  const processLeft = processors[left.$type]
  const processRight = processors[right.$type]

  left = processLeft(left, builder, options)
  right = processRight(right, builder, options)

  if (comparisonOperator === '*=') {
    comparisonOperator = 'ILIKE'
    right = `%${right.replace(/%/g, '\\%')}%`
  }

  builder.addClause(left, comparisonOperator, right)
}

export default processComparison
