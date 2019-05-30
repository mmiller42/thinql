const { exec } = require('child_process')
const { promisify } = require('util')
const { readFile, writeFile } = require('fs')

const asyncExec = promisify(exec)
const asyncReadFile = promisify(readFile)
const asyncWriteFile = promisify(writeFile)

const moveGrammarImports = async () => {
  await asyncExec('nearleyc src/grammar.ne -o dist/esm/grammar.js')

  const input = await asyncReadFile('./dist/esm/grammar.js', { encoding: 'utf8' })

  const importStatementLines = []
  const otherLines = []

  let isImport = false

  for (const line of input.split('\n')) {
    if (/^\s*import\s/.test(line)) {
      isImport = true
    }

    if (isImport) {
      importStatementLines.push(line)
    } else {
      otherLines.push(line)
    }

    if (/\s+from\s+'.*?'\s*$/.test(line)) {
      isImport = false
    }
  }

  const output = [
    ...importStatementLines,
    ...otherLines,
  ].join('\n')

  await asyncWriteFile('./dist/esm/grammar.js', output, { encoding: 'utf8' })
}

moveGrammarImports().catch(err => {
  console.error(err)
  process.exit(1)
})
