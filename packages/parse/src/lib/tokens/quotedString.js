import jju from 'jju/index.js'

const quotedString = {
  lineBreaks: true,
  match: [
    /"(?:[^"\\\n]*|\\["\\bfnrt\/]|\\u[0-9a-f]{4}|\\\n)*"/,
    /'(?:[^'\\\n]*|\\['\\bfnrt\/]|\\u[0-9a-f]{4}|\\\n)*'/,
  ],
  value: jju.parse,
}

export default quotedString
