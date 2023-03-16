import type { VueLoaderOptions } from './'
import type {
  RspackPluginInstance,
  Compiler,
  RuleSetRule,
  RuleSetUseItem,
  RuleSetCondition,
} from '@rspack/core'

const NS = 'vue-rsloader'

type RawRule = RuleSetRule

// rspack defaults rules
// 在这里主要是为了 clone rule
const rspackDefaultRule = (() => {
  const esm = {
    type: 'javascript/esm',
  }
  const commonjs = {
    // TODO: this is "javascript/dynamic" in webpack
    type: 'javascript/auto',
  }
  const rules: RuleSetRule[] = [
    {
      test: /\.json$/i,
      type: 'json',
    },
    {
      test: /\.mjs$/i,
      ...esm,
    },
    {
      test: /\.js$/i,
      // TODO:
      // descriptionData: {
      // 	type: "module"
      // },
      ...esm,
    },
    {
      test: /\.cjs$/i,
      ...commonjs,
    },
    {
      test: /\.js$/i,
      // TODO:
      // descriptionData: {
      // 	type: "commonjs"
      // },
      ...commonjs,
    },
    {
      test: /\.jsx$/i,
      type: 'jsx',
    },
    {
      test: /\.ts$/i,
      type: 'ts',
    },
    {
      test: /\.tsx$/i,
      type: 'tsx',
    },
  ]
  const cssRule = {
    type: 'css',
    resolve: {
      preferRelative: true,
    },
  }
  const cssModulesRule = {
    type: 'css/module',
  }
  rules.push({
    test: /\.css$/i,
    oneOf: [
      {
        test: /\.module\.css$/i,
        ...cssModulesRule,
      },
      {
        ...cssRule,
      },
    ],
  })
  return rules
})()

class VueLoaderPlugin implements RspackPluginInstance {
  static NS = NS

  apply(compiler: Compiler) {
    // @ts-ignore
    // const normalModule = compiler.webpack.NormalModule || NormalModule

    // add NS marker so that the loader can detect and report missing plugin
    // compiler.hooks.compilation.tap(id, (compilation) => {
    //   normalModule
    //     .getCompilationHooks(compilation)
    //     .loader.tap(id, (loaderContext: any) => {
    //       loaderContext[NS] = true
    //     })
    // })

    const rules = compiler.options.module!.rules
    let rawVueRule: RawRule
    let vueRules: RawRule[] = []

    for (const rawRule of rules) {
      if (rawRule === '...') {
        continue
      }
      if (match(rawRule, 'foo.vue')) {
        vueRules.push(rawRule)
      }
      if (!vueRules.length) {
        if (match(rawRule, 'foo.vue.html')) {
          vueRules.push(rawRule)
        }
      }
      if (vueRules.length > 0) {
        if (rawRule.oneOf) {
          throw new Error(
            `[VueLoaderPlugin Error] vue-rsloader currently does not support vue rules with oneOf.`
          )
        }
        rawVueRule = rawRule
        break
      }
    }
    if (!vueRules.length) {
      throw new Error(
        `[VueLoaderPlugin Error] No matching rule for .vue files found.\n` +
          `Make sure there is at least one root-level rule that matches .vue or .vue.html files.`
      )
    }

    // get the normlized "use" for vue files
    const vueUse = Array.isArray(vueRules[0].use)
      ? vueRules[0].use
      : [vueRules[0].use!]

    // get vue-rsloader options
    const vueLoaderUseIndex = vueUse.findIndex((u) => {
      // FIXME: this code logic is incorrect when project paths starts with `vue-rsloader-something`
      return /^vue-rsloader|(\/|\\|@)vue-rsloader/.test(
        typeof u === 'string' ? u : u.loader
      )
    })

    if (vueLoaderUseIndex < 0) {
      throw new Error(
        `[VueLoaderPlugin Error] No matching use for vue-rsloader is found.\n` +
          `Make sure the rule matching .vue files include vue-rsloader in its use.`
      )
    }

    // make sure vue-rsloader options has a known ident so that we can share
    // options by reference in the template-loader by using a ref query like
    // template-loader??vue-rsloader-options
    let vueLoaderUse = vueUse[vueLoaderUseIndex] as RuleSetUseItem
    vueLoaderUse =
      typeof vueLoaderUse === 'string' ? { loader: vueLoaderUse } : vueLoaderUse
    const vueLoaderOptions = (vueLoaderUse.options =
      vueLoaderUse?.options || {}) as VueLoaderOptions

    // for each user rule (except the vue rule), create a cloned rule
    // that targets the corresponding language blocks in *.vue files.
    const clonedRules = [...rspackDefaultRule, ...rules]
      .filter((r) => r !== '...' && r !== rawVueRule)
      .flatMap((rawRule: RuleSetRule) => cloneRule(rawRule))
      .filter(Boolean)

    rawVueRule!.use = vueUse

    // rule for template compiler
    const templateCompilerRule = {
      use: [
        {
          loader: require.resolve('./templateLoader'),
          options: vueLoaderOptions,
        },
      ],
      resourceQuery: /vue*.type=template/,
    }

    // for each rule that matches plain .js files, also create a clone and
    // match it against the compiled template code inside *.vue files, so that
    // compiled vue render functions receive the same treatment as user code
    // (mostly babel)
    const jsRulesForRenderFn = [...rspackDefaultRule, ...rules]
      .filter(
        (r) =>
          r !== '...' &&
          r !== rawVueRule &&
          (match(r, 'test.js') || match(r, 'test.ts'))
      )
      .flatMap((rawRule: RuleSetRule) => cloneRule(rawRule, true))
      .filter(Boolean)

    // replace original rules
    compiler.options.module!.rules = [
      ...jsRulesForRenderFn,
      templateCompilerRule,
      ...clonedRules,
      ...rules,
    ]
  }
}

function match(rule: RuleSetRule, fakeFile: string) {
  return rule.test instanceof RegExp && rule.test.test(fakeFile)
}

function cloneRule(
  rawRule: RawRule,
  isTemplate = false,
  parentExt?: string
): RawRule[] | undefined {
  const rawTest = rawRule.test
  const rawResourceQuery = rawRule.resourceQuery
  const isFileRegex =
    rawTest instanceof RegExp &&
    rawTest.source.startsWith('\\.') &&
    rawTest.source.endsWith('$')

  // css module
  const isModule = isFileRegex && rawTest.source.includes('module')
  // 提取文件后缀
  const extRaw = isFileRegex
    ? rawTest.source.slice(rawTest.source.lastIndexOf('\\.') + 2, -1)
    : ''
  const ext = extRaw ? extRaw : parentExt

  if (!ext) {
    return
  }

  const res = { ...rawRule }

  let langExtRegex: RegExp | undefined = undefined
  if (isTemplate) {
    if (ext.includes('ts')) {
      langExtRegex = new RegExp(`vue(?=.*type=template)(?=.*ts=true)`)
    } else if (ext.includes('js')) {
      langExtRegex = new RegExp(`vue.*type=template`)
    }
  } else if (isModule) {
    langExtRegex = new RegExp(`vue(?=.*module=true)(?=.*lang=${ext})`)
  } else if (ext !== parentExt) {
    // 保留原 rawResourceQuery 并添加 lang=ext 正则
    langExtRegex = new RegExp(`vue.*lang=${ext}`)
  }
  if (langExtRegex) {
    res.resourceQuery = mergeRuleSetCondition(rawResourceQuery, langExtRegex)
    delete res.test
  }

  if (rawRule.oneOf) {
    res.oneOf = rawRule.oneOf
      .flatMap((rule) => cloneRule(rule, isTemplate, ext))
      .filter(Boolean)

    if (!res.oneOf.length) {
      return
    }
  }

  if (res.type?.includes('css')) {
    const rawUse = res.use
    if (rawUse) {
      res.use = [
        { loader: require.resolve('./stylePostLoader') },
        ...(Array.isArray(rawUse) ? rawUse : [rawUse]),
      ]

      let resourceQuery = res.resourceQuery
      const inlineFlag = '&inline'

      return [
        {
          ...res,
          resourceQuery: mergeRuleSetCondition(
            resourceQuery,
            new RegExp(inlineFlag)
          ),
          use: [{ loader: require.resolve('./styleInlineLoader') }, ...res.use],
          type: 'js',
        },
        res,
      ]
    }
  }

  return [res]
}

function mergeRuleSetCondition(
  conditions1: RuleSetCondition | undefined,
  conditions2: RegExp
): RuleSetCondition {
  return { and: [conditions1, conditions2].filter(Boolean) }
}

export default VueLoaderPlugin
