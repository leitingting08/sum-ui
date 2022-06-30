const alias = require('../../alias')
const { viteBundler } = require('@vuepress/bundler-vite')
const { defaultTheme } = require('@vuepress/theme-default')
const demoblockPlugin = require('vuepress-plugin-demoblock-plus')

module.exports = {
    title: 'sum-ui', // 顶部左侧标题
    description: 'Vue3 + ElementPlus 组件库',
    base: '/sum-ui/',
    bundler: viteBundler({
        viteOptions: {
            css: {
                postcss: {
                    plugins: [require('tailwindcss'), require('autoprefixer')]
                }
            }
        }
    }),
    alias,
    head: [
        // 设置 描述 和 关键词
        ['meta', { name: 'keywords', content: 'Vue3 UI 组件库' }],
        [
            'meta',
            {
                name: 'description',
                content:
                    '此框架使用与二次开发，前端框架使用 Vue3，UI 框架使用 element-plus，全局数据状态管理使用 vuex，ajax 使用库为 axios。用于快速搭建中后台页面。'
            }
        ],
        // 添加百度统计
        [
            'script',
            {},
            `
      var _hmt = _hmt || [];
      (function() {
        var hm = document.createElement("script");
        hm.src = "https://hm.baidu.com/hm.js?09606fe130f768bfb1c3be82fdf56339";
        var s = document.getElementsByTagName("script")[0];
        s.parentNode.insertBefore(hm, s);
      })();
        `
        ]
    ],
    theme: defaultTheme({
        sidebar: {
            // 侧边栏
            '/': [
                {
                    text: '介绍',
                    children: [
                        { text: '安装', link: '/guide/install' },
                        { text: '快速上手', link: '/guide/start' }
                    ]
                },
                {
                    text: '组件',
                    children: [
                        { text: 'Layout 布局', link: '/components/layout' },
                        { text: 'Table 表格', link: '/components/table' }
                    ]
                }
            ]
        },
        navbar: [
            // 顶部右侧导航栏
            { text: '介绍', link: '/', activeMatch: '^/$|^/guide/' },
            {
                text: '组件',
                link: '/components/layout.html',
                activeMatch: '^/$|^/components/'
            }
        ],
        // page meta
        editLinkText: '在 GitHub 上编辑此页',
        lastUpdatedText: '上次更新',
        contributorsText: '贡献者'
    }),
    plugins: [
        demoblockPlugin({
            customClass: 'demoblock-custom',
            theme: 'github-light',
            cssPreprocessor: 'scss',
            scriptReplaces: [
                {
                    searchValue: /const ({ defineComponent as _defineComponent }) = Vue/g,
                    replaceValue: 'const { defineComponent: _defineComponent } = Vue'
                }
            ]
        })
    ]
}
