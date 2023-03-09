import Module from 'node:module'

const require = Module.createRequire(import.meta.url)
/**
 * @returns {import('@modern-js/builder-shared').DefaultBuilderPlugin}
 */
export const vueJsxPlugin = () => ({
  name: 'vue-jsx-plugin',
  setup(api) {
    api.modifyBundlerChain(async (chain) => {
      const rule = chain.module.rule('vue-jsx').test(/\.(t|j)sx$/)
      rule.use('vue-jsx').loader(require.resolve('babel-loader')).end()
    })
  },
})
