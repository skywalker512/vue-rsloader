import webpack = require('webpack')
declare class VueLoaderPlugin implements webpack.Plugin {
  static NS: string
  apply(compiler: webpack.Compiler): void
}

let Plugin: typeof VueLoaderPlugin

Plugin = require('./pluginRspack').default

export default Plugin
