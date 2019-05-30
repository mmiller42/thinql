const { CJS } = process.env

module.exports = {
  babelrcRoots: [
    '.',
    'packages/*',
  ],
  presets: [
    [
      '@babel/preset-env',
      {
        modules: CJS ? 'commonjs' : false,
        targets: {
          node: CJS ? 10 : true,
        },
      },
    ],
  ],
}
