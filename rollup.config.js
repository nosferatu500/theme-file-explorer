import nodeResolve from '@rollup/plugin-node-resolve'
import babel from '@rollup/plugin-babel'
import esbuild from 'rollup-plugin-esbuild'
import { sizeSnapshot } from 'rollup-plugin-size-snapshot'
import typescript from '@rollup/plugin-typescript'
import scss from 'rollup-plugin-scss'
import postcss from 'postcss'
import autoprefixer from 'autoprefixer'
import jsx from 'acorn-jsx'
import path from 'path'

const createBabelConfig = require('./babel.config')
const extensions = ['.js', '.ts', '.tsx']
const { root } = path.parse(process.cwd())

function external(id) {
  return !id.startsWith('.') && !id.startsWith(root)
}

function getBabelOptions(targets) {
  return {
    ...createBabelConfig({ env: (env) => env === 'build' }, targets),
    extensions,
    comments: false,
    babelHelpers: 'bundled',
  }
}

function getEsbuild(target) {
  return esbuild({
    minify: false,
    target,
    tsconfig: path.resolve('./tsconfig.json'),
  })
}

function createDeclarationConfig(input, output) {
  return {
    input,
    output: {
      dir: output,
    },
    external,
    acornInjectPlugins: [jsx()],
    plugins: [
      scss({
        output: false,
        processor: () => postcss([autoprefixer()]),
      }),
      typescript({ declaration: true, outDir: output }),
    ],
  }
}

function createESMConfig(input, output) {
  return {
    input,
    output: { file: output, format: 'esm' },
    external,
    plugins: [
      nodeResolve({ extensions }),
      scss({
        output: false,
        processor: () => postcss([autoprefixer()]),
      }),
      getEsbuild('node12'),
      sizeSnapshot(),
    ],
  }
}

function createCommonJSConfig(input, output) {
  return {
    input,
    output: { file: output, format: 'cjs', exports: 'named' },
    external,
    acornInjectPlugins: [jsx()],
    plugins: [
      nodeResolve({ extensions }),
      scss({
        output: false,
        processor: () => postcss([autoprefixer()]),
      }),
      typescript(),
      babel(getBabelOptions({ ie: 11 })),
      sizeSnapshot(),
    ],
  }
}

export default function (args) {
  return [
    createDeclarationConfig('src/index.ts', 'dist'),
    createCommonJSConfig('src/index.ts', 'dist/index.js'),
    createESMConfig('src/index.ts', 'dist/esm/index.js'),
  ]
}
