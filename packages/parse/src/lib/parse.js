import nearley from 'nearley'
import grammar from './grammar.js'

const { Grammar, Parser } = nearley
const parser = new Parser(Grammar.fromCompiled(grammar))

const parse = input => {
  const output = parser.feed(input)
  return output.results[0]
}

export default parse
