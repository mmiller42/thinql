#!/usr/bin/env node

import 'source-map-support/register'
import { createInterface } from 'readline'
import parse from '@thinql/parse'

const run = async () => {
  const [, , ...args] = process.argv

  const formatArg = args.find(arg => arg.startsWith('--'))
  const format = formatArg ? formatArg.substr(2) : 'query'

  let input = args.find(arg => !arg.startsWith('--'))

  if (!input) {
    input = await (async () => {
      const rl = createInterface({
        input: process.stdin,
        output: process.stdout,
      })

      const ask = () => new Promise(resolve => {
        rl.question('> ', answer => {
          rl.close()
          resolve(answer)
        })
      })

      do {
        const answer = await ask()
        if (answer.trim() !== '') {
          return answer
        }
      } while (true)
    })()
  }

  const tree = parse(input)

  console.log(input)
  console.log('---')

  switch (format) {
    case 'json':
      console.log(JSON.stringify(tree, null, 2))
      break
    case 'query':
    default:
      console.log(tree.toString())
      break
  }
}

run().catch(err => {
  console.error(err)
  process.exit(1)
})
