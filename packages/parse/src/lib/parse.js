import nearley from 'nearley'
import compiledGrammar from './grammar.js'

const { Grammar, Parser } = nearley
const grammar = Grammar.fromCompiled(compiledGrammar)

const parse = input => {
  const output = new Parser(grammar).feed(input)

  return output.results[0]
}

export default parse
