import { createBuilder } from '@modern-js/builder'
import { builderRspackProvider } from '@modern-js/builder-rspack-provider'
import { vuePlugin, vuePluginSvg } from './vue-builder-plugin.mjs'

import Module from 'node:module'

const require = Module.createRequire(import.meta.url)

const provider = builderRspackProvider({
  builderConfig: {
    html: {
      meta: {
        viewport: {
          content:
            'initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no',
        },
      },
      title: 'Rspack X Vue',
      mountId: 'app',
    },
    output: {
      svgDefaultExport: 'component',
    },
    tools: {
      postcss: (_config, utils) => {
        utils.addPlugins([
          require('tailwindcss')({ config: './tailwind.config.js' }),
        ])
      },
    },
  },
})

const builder = await createBuilder(provider, {
  entry: {
    index: './src/main.ts',
  },
})

builder.removePlugins(['builder-plugin-react'])
builder.addPlugins([vuePlugin(), vuePluginSvg()])

if (process.argv[2] === 'build') {
  await builder.build()
} else {
  builder.startDevServer()
}
