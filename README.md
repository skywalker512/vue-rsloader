<p align='center'>
  <img src='https://user-images.githubusercontent.com/12960906/223734670-ca658c81-59e8-4170-bd69-d07f92c18716.png' alt='vue-rsloader - Vue loader for Rspack' width='400'/>
</p>

<h6 align='center'>
<a href="https://vue-rsloader.512.pub/">Online Demo</a>
</h6>

<h5 align='center'>
<b>Fork version of <a href="https://vue-loader.vuejs.org/">vue-loader</a> for <a href="https://rspack.dev">Rspack</a></b>
</h5>

<br>

<p align='center'>
<b>English</b> | <a href="https://github.com/skywalker512/vue-rsloader/blob/main/README.zh-CN.md">简体中文</a>
</p>

> **Warning**: JUST FOR FUN, NOT FOR PRODUCTION.

## Why This

As Rspack does not yet support functional rule condition and [loader pitch](https://webpack.js.org/api/loaders/#pitching-loader), this loader use [Regex](./packages/vue-rsloader/src/pluginRspack.ts) (Generated by ChatGPT) to generate clone rules and inject related css loaders.

## Features

Mainly inherited from vue-loader

- 🗂 [Single-File Components](https://vuejs.org/guide/scaling-up/sfc.html)

- 🔥 State-preserving hot-reloading during development. (HMR)

- 🎨 Treat static assets referenced in `<style>` and `<template>` as module dependencies and handle them with rspack loaders;

- ✅ Simulate scoped CSS for each component

- 🦾 TypeScript in `<template>`

## Install

Just like vue-loader, you can install it and then add it to your rspack config.

```shell
pnpm i -D vue-rsloader
```

### Rspack Configuration

```js
// rspack.config.js
const { VueLoaderPlugin } = require('vue-rsloader')

module.exports = {
  module: {
    rules: [
      // ... other rules
      {
        test: /\.vue$/,
        use: [
          {
            loader: require.resolve('vue-rsloader'),
            options: {
              // In the following text, it will be mentioned this
            },
          },
        ],
      },
      // because rspack handles ts, css internally
      // we don't need those loaders like ts-loader, css-loader, it just works
    ],
  },
  plugins: [
    // make sure to include the plugin!
    new VueLoaderPlugin(),
  ],
}
```

## Example

- [modernjs-builder](./example/modernjs-builder/) - [Demo](https://vue-rsloader.512.pub/)
- [Pure Rspack fork from Vitesse-lite](https://github.com/skywalker512/rspacksse-lite) - [Demo](https://rspacksse-lite.512.pub/)

## Options

```ts
export interface VueLoaderOptions {
  // https://babeljs.io/docs/en/next/babel-parser#plugins
  babelParserPlugins?: SFCScriptCompileOptions['babelParserPlugins']
  /**
   * Configure what tags/attributes to transform into asset url imports,
   * or disable the transform altogether with `false`.
   * @default true
   */
  transformAssetUrls?: SFCTemplateCompileOptions['transformAssetUrls']
  /**
   * Use custom compiler-sfc instance. Can be used to force a specific version.
   */
  compiler?: TemplateCompiler
  // options to pass on to vue/compiler-sfc
  compilerOptions?: CompilerOptions
  /**
   * Enable Vue reactivity transform (experimental).
   * https://vuejs.org/guide/extras/reactivity-transform.html
   * - `true`: transform will be enabled for all vue [js(x),ts(x) wip] files except
   *           those inside node_modules
   * - `false`: disable in all cases
   *
   * @default false
   */
  reactivityTransform?: boolean
  /**
   * Transform Vue SFCs into custom elements.
   * - `true`: all `*.vue` imports are converted into custom elements
   * - `RegExp`: matched files are converted into custom elements
   *
   * @default /\.ce\.vue$/
   */
  customElement?: boolean | RegExp

  /**
   * @default: true in development mode, false in production mode or when the rspack config has target: 'node'.
   * allowed value: false (true will not force Hot Reload neither in production mode nor when target: 'node')
   *  Whether to use webpack Hot Module Replacement to apply changes in the browser without reloading the page. Use this
   * option (value false) to disable the Hot Reload feature in development mode.
   */
  hotReload?: boolean
  /**
   * In non-production environments, vue-loader injects a __file property to components for better debugging experience. If the
   * name property is missing in a component, Vue will infer it from the __file field to display in console warnings.
   * This property is stripped in production builds by default. But you may want to retain it if you are developing a component
   * library and don't want to bother specifying name in each component. Then you can turn this option on.
   * @default false
   */
  exposeFilename?: boolean
  /**
   * not use
   */
  appendExtension?: boolean
  /**
   * Indicates that transforms and codegen should try to output valid TS code
   * @default: when lang=tsx? is true, other situations are false
   */
  enableTsInTemplate?: boolean

  /**
   * templateOptions.ssr
   * @default false
   */
  isServerBuild?: boolean
}
```
