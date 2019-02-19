const { parse, stringify } = require('jju')

const flagsRegExpString = '[A-Za-z0-9~@#\\$%\\^&\\-_\\+\\|\\?:,\\./]'
const flagsRegExp = new RegExp(`${flagsRegExpString}*$`)

const unquotedStringRegExp = /[A-Za-z0-9._-]+/
const unquotedStringTokenRegExp = new RegExp(`^${unquotedStringRegExp.source}$`)

const quoteWithoutFlagRegExps = ['"', "'"].map(symbol => new RegExp(
  `${symbol}(?:[^${symbol}\\\\\\n]*|\\\\[${symbol}\\\\bfnrt/]|\\\\u[0-9a-f]{4}|\\\\\\n)*${symbol}`
))

exports.divide = (items, predicate) => items.reduce(([truthyItems, falsyItems], item, i) => {
  if (predicate(item, i, items)) {
    truthyItems.push(item)
  } else {
    falsyItems.push(item)
  }
  return [truthyItems, falsyItems]
}, [[], []])

exports.escape = (string, { alwaysQuote, symbol }) => {
  if (!alwaysQuote && unquotedStringTokenRegExp.test(string)) {
    return string
  }

  return stringify(string, { quote: symbol })
}

exports.parseString = text => {
  const [flags] = text.match(flagsRegExp)
  const string = text.substr(0, text.length - flags.length)

  return { value: parse(string), flags }
}

exports.quoteWithFlagRegExps = quoteWithoutFlagRegExps.map(regExp => new RegExp(
  `${regExp.source}${flagsRegExpString}+`
))

exports.quoteWithoutFlagRegExps = quoteWithoutFlagRegExps

exports.unquotedStringRegExp = unquotedStringRegExp
