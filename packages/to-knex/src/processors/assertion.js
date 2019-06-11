import Builder from '../Builder.js'
import processors from './index.js'

const processAssertion = (assertionNode, builder, options) => {
  const { assertion, negated } = assertionNode
  const { $type: type } = assertion

  const process = processors[assertion.$type]

  if (type === Builder.AND || type === Builder.OR || negated) {
    const logicalOperator =
      type === Builder.AND || type === Builder.OR ? type : null

    builder.addGroup(nextBuilder => {
      process(assertion, nextBuilder, options)
    }, negated, logicalOperator)
  } else {
    process(assertion, builder, options)
  }
}

export default processAssertion
