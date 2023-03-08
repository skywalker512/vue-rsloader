<p align='center'>
  <img src='https://user-images.githubusercontent.com/12960906/223734670-ca658c81-59e8-4170-bd69-d07f92c18716.png' alt='vue-rsloader - Vue loader for Rspack' width='400'/>
</p>

<h6 align='center'>
<a href="https://vue-rsloader.512.pub/">在线 Demo</a>
</h6>

<h5 align='center'>
<b>Fork version of <a href="https://vue-loader.vuejs.org/zh/">vue-loader</a> for <a href="https://rspack.dev">Rspack</a></b>
</h5>

<br>

<p align='center'>
<a href="https://github.com/skywalker512/vue-rsloader/blob/main/README.md">English</a> | <b>简体中文</b>
</p>

> **Warning**: JUST FOR FUN, NOT FOR PRODUCTION.

## Why This

由于 Rspack 还不支持 functional rule condition 和 [loader pitch](https://webpack.docschina.org/api/loaders/#pitching-loader)，这个插件使用 [Regex](./packages/vue-rsloader/src/pluginRspack.ts) 来生成克隆规则和注入相关的 css loader。

## Features

主要继承自 vue-loader

- 🗂 [单文件组件](https://vuejs.org/guide/scaling-up/sfc.html)

- 🔥 在开发过程中保持状态的热重载。(HMR)

- 🎨 将 `<style>` 和 `<template>` 中引用的静态资产视为模块依赖，并用 rspack loader 处理它们。

- ✅ 为每个组件 Simulate scoped CSS

- 🦾 `<template>`中的 TypeScript

## Install

就像使用 vue-loader 一样，安装然后把它添加到你的 rspack 配置中

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
      // ... 其他规则
      {
        test: /\.vue$/,
        use: [
          {
            loader: require.resolve('vue-rsloader'),
            options: {
              // 在后文有 options 参考
            },
          },
        ],
      },
      // 因为rspack在内部处理ts、css 我们不需要 ts-loader，css-loader 这样的 loader
    ],
  },
  plugins: [
    // 确保包含插件！
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
   * 配置要转换为资产URL导入的标签/属性，或者使用 “false” 完全禁用转换。
   * @default true
   */
  transformAssetUrls?: SFCTemplateCompileOptions['transformAssetUrls']
  /**
   * 使用自定义的 compiler-sfc 实例。可用于强制指定版本。
   */
  compiler?: TemplateCompiler
  // 传递给 vue/compiler-sfc 的选项
  compilerOptions?: CompilerOptions
  /**
   * 启用Vue响应式转换（实验性）。
   * https://vuejs.org/guide/extras/reactivity-transform.html
   * - `true`：将启用所有 vue [js(x)，ts(x) wip] 文件的转换，除了 node_modules 中的文件。
   * - `false`：在所有情况下禁用。
   *
   * @default false
   */
  reactivityTransform?: boolean
  /**
   * 将 Vue SFC 转换为custom elements
   * - `true`：所有`*.vue`导入都将被转换为custom elements
   * - `RegExp`：匹配的文件将被转换为custom elements
   *
   * @default /\.ce\.vue$/
   */
  customElement?: boolean | RegExp

  /**
   * @default: 在开发模式下为 true，在生产模式下或 rspack config target: 'node' 时为false。
   * 允许的值：false（true不会强制热重载，无论是在生产模式还是当目标为'node'时）
   */
  hotReload?: boolean
  /**
   * 在开发环境中，vue-loader 为组件注入 __file 属性以提供更好的调试体验。如果组件缺少 name 属性
   * 则 Vue 将从 __file 字段推断出名称以在控制台警告中显示。默认情况下，在生产构建中会剥离此属性。
   * 但是，如果您正在开发一个组件库并且不想在每个组件中指定名称，则可能希望保留它。
   * @default false
   */
  exposeFilename?: boolean
  /**
   * not use
   */
  appendExtension?: boolean
  /**
   * Template 是否需要生成或者识别 ts 代码
   * @default: 当 lang=tsx? 为true时，其他情况为false
   */
  enableTsInTemplate?: boolean

  /**
   * templateOptions.ssr
   * @default false
   */
  isServerBuild?: boolean
}
```
