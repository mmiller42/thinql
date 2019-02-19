const path = require('path')
const { lexer } = require('./lexer')
const { parse } = require('./parse')
const types = require('./types')

exports.grammarPath = path.resolve(__dirname, 'lib', 'grammar.js')
exports.lexer = lexer
exports.parse = parse
exports.types = types
