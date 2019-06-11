import memoizeOne from 'memoize-one'

class MemoizedWeakMap extends WeakMap {
  constructor(iterable) {
    super(iterable)

    this.get = memoizeOne(this.get.bind(this))
  }
}

export default MemoizedWeakMap
