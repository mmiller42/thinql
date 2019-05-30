import {
  closeBracket,
  comparisonOperator,
  logicalOrOperator,
  negator,
  openBracket,
  quotedString,
  unquotedString,
  whitespace,
} from './tokens/index.js'
import moo from 'moo'

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
