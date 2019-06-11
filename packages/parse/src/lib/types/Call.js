import _Node, { attributeSetsMap, registerType } from './_Node.js'

export default class Call extends _Node {
  static get name() {
    return 'Call'
  }

  constructor({ arguments: args, callee }, token) {
    super({ arguments: args, callee }, token)
  }

  get arguments() {
    return attributeSetsMap.get(this).arguments
  }

  get callee() {
    return attributeSetsMap.get(this).callee
  }

  toString() {
    const { arguments: args, callee } = this

    return `${callee}(${args.join(' ')})`
  }
}

registerType(Call)
