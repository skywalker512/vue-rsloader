import { SVG_REGEX, JS_REGEX, TS_REGEX } from '@modern-js/builder-shared'

import Module from 'node:module'

const require = Module.createRequire(import.meta.url)

/**
 * @returns {import('@modern-js/builder-shared').DefaultBuilderPlugin}
 */
export const vuePluginSvg = () => ({
  name: 'vue-plugin-svg',
  setup(api) {
    api.modifyBundlerChain(async (chain, { CHAIN_ID }) => {
      const rule = chain.module.rule(CHAIN_ID.RULE.SVG).test(SVG_REGEX)
      rule
        .oneOf(CHAIN_ID.ONE_OF.SVG)
        .use(CHAIN_ID.USE.SVGR)
        .clear()
        .loader(require.resolve('./svg.js'))

      const issuer = [/\.vue$/, JS_REGEX, TS_REGEX]
      rule.oneOf('svg-asset-url').issuer({ not: issuer })
      rule.oneOf('svg-asset-inline').issuer({ not: issuer })
      rule.oneOf('svg-asset').issuer({ not: issuer })
    })
  },
})

/**
 * @returns {import('@modern-js/builder-shared').DefaultBuilderPlugin}
 */
export const vuePlugin = () => ({
  name: 'vue-plugin',
  setup(api) {
    api.modifyBundlerChain(async (chain) => {
      const plugin = chain.plugin('vue')

      plugin.use(require('vue-rsloader').VueLoaderPlugin)

      const rule = chain.module.rule('vue').test(/\.vue$/)
      rule.use('vue').loader(require.resolve('vue-rsloader')).options({})
    })
  },
})
