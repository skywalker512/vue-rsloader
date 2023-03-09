import Module from 'node:module'
import rehypeHighlight from 'rehype-highlight'
const require = Module.createRequire(import.meta.url)
/**
 * @returns {import('@modern-js/builder-shared').DefaultBuilderPlugin}
 */
export const vueMdxPlugin = () => ({
  name: 'vue-mdx-plugin',
  setup(api) {
    api.modifyBundlerChain(async (chain) => {
      /** @type {import('@mdx-js/loader').Options} */
      const options = {
        providerImportSource: '@mdx-js/vue',
        jsx: true,
        rehypePlugins: [rehypeHighlight],
      }

      const rule = chain.module.rule('vue-mdx').test(/\.mdx?$/)
      rule
        .use('vue-jsx-mdx')
        .loader(require.resolve('babel-loader'))
        .end()
        .use('vue-mdx')
        .loader(require.resolve('@mdx-js/loader'))
        .options(options)
        .end()
    })
  },
})
