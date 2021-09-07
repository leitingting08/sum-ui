
import { readdirSync } from 'fs'
import { join } from 'path'
import chalk from 'chalk'
import vueJsx from '@vitejs/plugin-vue-jsx'

const headPkgList = []; // 非 @sum-ui/开头的组件

const pkgList = readdirSync(join(__dirname, '../../packages')).filter(
  (pkg) => pkg.charAt(0) !== '.' && !headPkgList.includes(pkg),
);

const alias = pkgList.reduce((pre, pkg) => {
  pre[`@sum-ui/${pkg}`] = join(__dirname, '../../packages', pkg, 'src/Index.vue');
  return {
    ...pre,
  };
}, {});

console.log(`🌼 alias list \n${chalk.blue(Object.keys(alias).join('\n'))}`);

module.exports = {
  title: "sum-ui", // 顶部左侧标题
  description: 'Vue3 + ElementPlus 组件库',
  base: '/sum-ui/',
  bundler: '@vuepress/vite',
  bundlerConfig: {
    viteOptions: {
      plugins: [
        vueJsx()
      ]
    }
  },
  alias,
  head: [
    // 设置 描述 和 关键词
    [
      "meta",
      { name: "keywords", content: "Vue3 UI 组件库" },
    ],
    [
      "meta",
      {
        name: "description",
        content:
          "此框架使用与二次开发，前端框架使用 Vue3，UI 框架使用 element-plus，全局数据状态管理使用 vuex，ajax 使用库为 axios。用于快速搭建中后台页面。",
      },
    ],
  ],
  themeConfig: {
    sidebar: {
      // 侧边栏
      "/": [
        {
          text: "介绍",
          children: [
            { text: "安装", link: "/guide/install" },
            { text: "快速上手", link: "/guide/start" },
          ],
        },
        {
          text: "组件",
          children: [
            
            { text: "Layout 布局", link: "/components/layout" },
            { text: "Table 表格", link: "/components/table" }
          ],
        },
      ],
    },
    nav: [
      // 顶部右侧导航栏
      { text: "介绍", link: "/", activeMatch: "^/$|^/guide/" },
      {
        text: "组件",
        link: "/components/layout.html",
        activeMatch: "^/$|^/components/"
      }
    ],
    // page meta
    editLinkText: '在 GitHub 上编辑此页',
    lastUpdatedText: '上次更新',
    contributorsText: '贡献者',
  },
  plugins: ['demoblock-plus']
};