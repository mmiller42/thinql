const processCall = (call, builder, options) => {
  const { callee, arguments: args } = call
  const fn = options.functions[callee]

  return fn(args.map(arg => {
    if (arg && arg.$type === 'Call') {
      return processCall(arg, null, options)
    }

    return arg
  }), builder ? builder.knexBuilder : null)
}

export default processCall
