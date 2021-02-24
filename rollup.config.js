import path from 'path'
import ts from 'rollup-plugin-typescript2'
import strip from '@rollup/plugin-strip';

// const packagesDir = path.resolve(__dirname, 'packages')
const targetDir = path.resolve(__dirname)


const srcDir = path.resolve(targetDir, 'src')
const resolve = p => path.resolve(srcDir, p) 


let conf = createConfig('', {
  file: path.resolve(targetDir, `dist/index.js`),
  format: `es`
})

export default conf



function createConfig(format, output, plugins = []) {
  const entryFile =  `index.ts` 
  // output.sourcemap = true
  output.externalLiveBindings = false
  output.name = `index.${format}`

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

  return {
    input: resolve(entryFile),
    plugins: [
      tsPlugin,
      strip({
        include: ['**/*.ts'],
        functions: ['console.*'],
      })
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