import jju from 'jju/index.js'
import { unquotedString } from '../tokens/index.js'

const unquotedStringRegExp = new RegExp(`^${unquotedString.match.source}$`)

const stringify = (content, literal = false) => {
  if (!literal && unquotedStringRegExp.test(content)) {
    return content
  } else {
    return jju.stringify(content)
  }
}

export default stringify
