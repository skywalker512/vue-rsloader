const { compileTemplate } = require('vue/compiler-sfc')

const VueSvgLoader = function (source) {
  source = String(source)

  const loaderContext = this

  const { code } = compileTemplate({
    id: loaderContext.resourcePath,
    source,
    filename: loaderContext.resourcePath,
    transformAssetUrls: false,
  })

  loaderContext.callback(null, `${code}\nexport default { render: render }`)
}

module.exports = VueSvgLoader
