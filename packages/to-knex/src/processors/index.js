import processAssertion from './assertion.js'
import processCall from './call.js'
import processComparison from './comparison.js'
import processFullTextSearch from './fullTextSearch.js'
import processLogicalExpression from './_logicalExpression.js'
import processProperty from './property.js'
import processValue from './value.js'

const processors = {
  Assertion: processAssertion,
  Call: processCall,
  Comparison: processComparison,
  FullTextSearch: processFullTextSearch,
  LogicalAndExpression: processLogicalExpression,
  LogicalOrExpression: processLogicalExpression,
  Property: processProperty,
  Value: processValue,
}

export default processors
