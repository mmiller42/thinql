import Builder from '../Builder.js'
import processAssertion from './assertion.js'

const processLogicalExpression = (logicalExpression, builder, options) => {
  const { $type: type, assertions } = logicalExpression

  builder.logicalOperator =
    type === Builder.AND ? Builder.AND : Builder.OR

  for (const assertion of assertions) {
    processAssertion(assertion, builder, options)
  }
}

export default processLogicalExpression
