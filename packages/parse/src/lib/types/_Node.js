import './_typedefs.js'

const privates = new WeakMap()

export default class _Node {
  /**
   * @param {Object} attributes
   * @param {_Node | _Token} token
   */
  constructor(attributes, token = null) {
    privates.set(this, {
      attributes,
      token: token instanceof _Node ? token.token : token,
    })
  }

  get attributes() {
    return privates.get(this).attributes
  }

  get token() {
    return privates.get(this).token
  }

  get type() {
    return this.constructor.type
  }

  toJSON() {
    return { $type: this.type, ...this.attributes }
  }
}
