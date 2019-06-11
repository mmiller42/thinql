import MemoizedWeakMap from '../utils/MemoizedWeakMap.js'

const attributeSetsMap = new MemoizedWeakMap()

class Token {
  constructor({ col, line, offset }) {
    attributeSetsMap.set(this, { col, line, offset })
  }

  get col() {
    return attributeSetsMap.get(this).col
  }

  get line() {
    return attributeSetsMap.get(this).line
  }

  get offset() {
    return attributeSetsMap.get(this).offset
  }

  toJSON() {
    const { col, line, offset } = this

    return { col, line, offset }
  }
}

module.exports = Token
