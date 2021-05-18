import path from 'path'
import ts from 'rollup-plugin-typescript2'
import strip from '@rollup/plugin-strip';
import postcss from 'rollup-plugin-postcss';
import { terser } from "rollup-plugin-terser";

// const packagesDir = path.resolve(__dirname, 'packages')
const targetDir = path.resolve(__dirname)

const srcDir = path.resolve(targetDir, 'src')
const resolve = p => path.resolve(srcDir, p)


let conf = createConfig('', {
  file: path.resolve(targetDir, `dist/index.js`),
  format: `es`
})

// export default conf
export default [createConfig('', {
  file: path.resolve(targetDir, `dist/index.js`),
  format: `es`
}), createConfig("iife", {
  file: path.resolve(targetDir, `dist/index-browser.js`),
  format: `iife`,
  name: '__GLOBAL__'
})]



function createConfig(format, output, plugins = []) {
  const entryFile = `index.ts`
  output.sourcemap = true
  const tsPlugin = ts({
    check: true,
    tsconfig: path.resolve(targetDir, 'tsconfig.json'),
    cacheRoot: path.resolve(targetDir, 'node_modules/.rts2_cache'),
    useTsconfigDeclarationDir: true,
    tsconfigDefaults: {
      declaration: true,
      declarationDir: 'dist',
    }
  })
  const nodePlugins = format !== 'cjs'
    ? [
      require('@rollup/plugin-node-resolve').nodeResolve({
        preferBuiltins: true
      }),
      require('@rollup/plugin-commonjs')({
        sourceMap: false
      }),
      require('rollup-plugin-node-builtins')(),
      require('rollup-plugin-node-globals')()
    ]
    : []
  const cssPlugins = [postcss({
    extract: true,
    modules: false,
    use: ['sass'],
  })]

  const terserPlugin = process.env.NODE_ENV === 'production'?[terser(), strip({
    include: ['**/*.ts'],
    functions: ['console.*'],
  })]:[]

  return {
    input: resolve(entryFile),
    plugins: [
      tsPlugin,
      ...nodePlugins,
      ...cssPlugins,
      ...terserPlugin
    ],
    output,
    onwarn: (warn) => {
      if (warn.code === 'THIS_IS_UNDEFINED') {
        return
      }
    },
    treeshake: {
      moduleSideEffects: false
    }
  }
}