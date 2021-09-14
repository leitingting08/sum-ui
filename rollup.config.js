import fs from 'fs'
import path from 'path'
import json from '@rollup/plugin-json'
import postcss from 'rollup-plugin-postcss'
import vue from '@vitejs/plugin-vue'
import { terser } from 'rollup-plugin-terser'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import babel from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import { DEFAULT_EXTENSIONS } from '@babel/core'

const isDev = process.env.NODE_ENV !== 'production'
// packages 文件夹路径
const root = path.resolve(__dirname, 'packages')

// 公共插件配置
const getPlugins = () => {
    return [
        vue(),
        typescript({
            tsconfig: './tsconfig.json'
        }),
        nodeResolve({
            mainField: ['jsnext:main', 'browser', 'module', 'main'],
            browser: true
        }),
        commonjs(),
        json(),
        postcss({
            plugins: [require('autoprefixer')],
            // 把 css 插入到 style 中
            inject: true,
            // 把 css 放到和js同一目录
            // extract: true
            // Minimize CSS, boolean or options for cssnano.
            minimize: !isDev,
            // Enable sourceMap.
            sourceMap: isDev,
            // This plugin will process files ending with these extensions and the extensions supported by custom loaders.
            extensions: ['.sass', '.less', '.scss', '.css']
        }),
        babel({
            exclude: 'node_modules/**',
            babelHelpers: 'runtime',
            // babel 默认不支持 ts 需要手动添加
            extensions: [...DEFAULT_EXTENSIONS, '.ts', '.tsx', '.vue']
        }),
        // 如果不是开发环境，开启压缩
        !isDev && terser({ toplevel: true })
    ]
}

module.exports = fs
    .readdirSync(root)
    // 过滤，只保留文件夹
    .filter(item => fs.statSync(path.resolve(root, item)).isDirectory())
    // 为每一个文件夹创建对应的配置
    .map(item => {
        const pkg = require(path.resolve(root, item, 'package.json'))
        return {
            input: path.resolve(root, item, 'src/main.ts'),
            output: [
                {
                    name: 'index',
                    file: path.resolve(root, item, pkg.main),
                    format: 'umd',
                    sourcemap: isDev,
                    globals: {
                        vue: 'vue',
                        'element-plus': 'element-plus'
                    }
                },
                {
                    name: 'index.module',
                    file: path.join(root, item, pkg.module),
                    format: 'es',
                    sourcemap: isDev,
                    globals: {
                        vue: 'vue',
                        'element-plus': 'element-plus'
                    }
                }
            ],
            onwarn: function (warning) {
                if (warning.code === 'THIS_IS_UNDEFINED' || warning.code === 'CIRCULAR_DEPENDENCY') {
                    return
                }
                console.error(`(!) ${warning.message}`)
            },
            plugins: getPlugins(),
            external: Object.keys(require(path.join(root, item, 'package.json'))?.peerDependencies || {})
        }
    })
