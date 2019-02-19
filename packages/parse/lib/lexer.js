const moo = require('moo')
const { ComparisonOperator, LogicalOperator } = require('./types')
const {
  parseString,
  quoteWithFlagRegExps,
  quoteWithoutFlagRegExps,
  unquotedStringRegExp,
} = require('./utils')

const lexer = moo.compile({
  quotedStringWithFlags: {
    match: quoteWithFlagRegExps,
    lineBreaks: true,
    value: parseString,
  },
  quotedStringWithoutFlags: {
    match: quoteWithoutFlagRegExps,
    lineBreaks: true,
    value: text => parseString(text).value,
  },
  unquotedString: {
    match: unquotedStringRegExp,
    type: moo.keywords(LogicalOperator.operators),
  },
  negatedCallee: {
    match: new RegExp(`!${unquotedStringRegExp.source}`),
    value: text => text.substr(1)
  },
  negatedFullTextSearch: {
    match: [...quoteWithFlagRegExps, ...quoteWithoutFlagRegExps]
      .map(regExp => new RegExp(`!${regExp.source}`)),
    lineBreaks: true,
    value: text => parseString(text.substr(1)),
  },
  eof: { match: /\s*;\s*/, lineBreaks: true },
  space: { match: /\s+/, lineBreaks: true },
  openGroup: {
    match: /!?\(/,
    value: s => ({ negate: /!/.test(s) }),
  },
  closeGroup: ')',
  ...Object.keys(ComparisonOperator.operators).reduce((tokens, kind) => {
    const symbol = ComparisonOperator.operators[kind]
    tokens[kind] = Array.isArray(symbol) ? new RegExp(symbol.join('|')) : symbol
    return tokens
  }, {}),
})

exports.lexer = lexer
