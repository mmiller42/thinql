import closeBracket from './tokens/closeBracket.js'
import comparisonOperator from './tokens/comparisonOperator.js'
import logicalOrOperator from './tokens/logicalOrOperator.js'
import moo from 'moo'
import negator from './tokens/negator.js'
import openBracket from './tokens/openBracket.js'
import quotedString from './tokens/quotedString.js'
import unquotedString from './tokens/unquotedString.js'
import whitespace from './tokens/whitespace.js'

const lexer = moo.compile({
  quotedString,
  comparisonOperator,
  logicalOrOperator,
  openBracket,
  closeBracket,
  negator,
  whitespace,
  unquotedString,
})

export default lexer
