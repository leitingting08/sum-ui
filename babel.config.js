module.exports = {
  // ATTENTION!!
  // Preset ordering is reversed, so `@babel/typescript` will called first
  // Do not put `@babel/typescript` before `@babel/env`, otherwise will cause a compile error
  // See https://github.com/babel/babel/issues/12066
  presets: [
    [
      '@babel/env',
      {
        loose: true,
        modules: false,
      },
    ],
    [
      '@babel/typescript',
      {
        isTSX: true,
        allExtensions: true
      }
    ]
  ],
  plugins: [
    '@vue/babel-plugin-jsx',
    '@babel/transform-runtime',
    [
      'import',
      {
        libraryName: 'element-plus',
        // 引入组件
        customName: name => {
          name = name.slice(3)
          return `element-plus/lib/components/${name}`
        },
        // 引入样式
        customStyleName: name => {
          name = name.slice(3)
          // 如果你需要引入 [name].scss 文件，你需要用下面这行
          return `element-plus/lib/components/${name}/style`
        },
      },
    ],
  ],
  env: {
    utils: {
      ignore: [
        '**/*.test.ts',
        '**/*.spec.ts',
      ],
      presets: [
        [
          '@babel/env',
          {
            loose: true,
            modules: false,
          },
        ],
      ],
    },
  },
}