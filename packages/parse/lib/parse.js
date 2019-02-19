const { Grammar, Parser } = require('nearley')
const grammar = require('./grammar')

const parser = new Parser(Grammar.fromCompiled(grammar))

exports.parse = input => {
  parser.feed(`${input};`)
  return parser.results[0]
}
