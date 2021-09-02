---
title: 'Layout'
desc: 'desc'
---

### @sum-ui/layout

::: demo

```vue
<template>
  <sum-layout :settings="settings" class="sum-layout">
     <template #title>
       <div class="title">
        <img style="height: 50px;margin-right: 10px;" src="data:image/svg+xml;base64,PHN2ZyBpZD0i5Zu+5bGCXzEiIGRhdGEtbmFtZT0i5Zu+5bGCIDEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgdmlld0JveD0iMCAwIDQ0IDQ0Ij48ZGVmcz48c3R5bGU+LmNscy0xe2ZpbGw6IzQwOWVmZjtmaWxsLXJ1bGU6ZXZlbm9kZDt9PC9zdHlsZT48L2RlZnM+PHRpdGxlPmVsZW1lbnQgcGx1cy1sb2dvLXNtYWxsIOWJr+acrDwvdGl0bGU+PHBhdGggaWQ9ImVsZW1lbnRfcGx1cy1sb2dvLXNtYWxsIiBkYXRhLW5hbWU9ImVsZW1lbnQgcGx1cy1sb2dvLXNtYWxsIiBjbGFzcz0iY2xzLTEiIGQ9Ik0zNy40MSwzMi4zN2MwLDEuNTctLjgzLDEuOTMtLjgzLDEuOTNMMjEuNTEsNDNBMS42OSwxLjY5LDAsMCwxLDIwLDQzUzUuMiwzNC40LDQuNjYsMzRhMS4yOSwxLjI5LDAsMCwxLS41NS0xVjE1LjI0YzAtLjc4LDEtMS4zMywxLTEuMzNMMTkuODYsNS4zNmEyLDIsMCwwLDEsMS43OSwwbDE0LjQ2LDguNDFhMi4wNiwyLjA2LDAsMCwxLDEuMjUsMi4wNlYzMi4zN1ptLTUuOS0xN0wyMS4zNSw5LjVhMS41OSwxLjU5LDAsMCwwLTEuNDEsMEw4LjMzLDE2LjE1cy0uNzcuNDYtLjc2LDEuMDgsMCwxMy45MiwwLDEzLjkyQTEsMSwwLDAsMCw4LDMxLjljLjQzLjMsMTIsNywxMiw3YTEuMzEsMS4zMSwwLDAsMCwxLjE5LDBDMjEuOTEsMzguNSwzMywzMi4xMSwzMywzMi4xMXMuNjUtLjI4LjY1LTEuNTFWMjcuMTNsLTEzLDcuOVYzMmEzLjA1LDMuMDUsMCwwLDEsMS0yLjA3TDMzLjIsMjNhMi40NCwyLjQ0LDAsMCwwLC41NS0xLjQ2VjE4LjQzTDIwLjY0LDI2LjM1di0zLjJhMi4yMiwyLjIyLDAsMCwxLC44My0xLjc5Wk00MS4wNyw0LjIyYS4zOS4zOSwwLDAsMC0uMzctLjQySDM4VjEuMDZjMC0uMTYtLjI2LS4yMi0uNTMtLjIyTDM2LDEuMDhjLS4xOCwwLS4zMS4xMi0uMzEuMjNWMy44SDMzYS40LjQsMCwwLDAtLjM2LjM3djJoM1Y5YzAsLjE2LjI2LjI3LjU0LjIzbDEuNTEtLjI1Yy4xOCwwLC4yOS0uMTMuMjktLjIzVjYuMTRoM1oiLz48L3N2Zz4=">
        <div>测试标题</div>
       </div>
     </template>
     <template #right>
        <div>admin</div>
      </template>
      <template #default>
        <div>container</div>
      </template>
  </sum-layout>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue'

export default defineComponent({
  setup() {
    const settings = reactive({
        // 可以用slot插槽或者render渲染函数两种方式，当使用render的时候需要改成 <script lang="tsx">
        headerTitle: {
          slot: 'title'
        },
        // headerTitle: () => 
        //        <div class="title">
        //           <img
        //             src="./logo.png"
        //             alt="header-logo"
        //             />
        //             <div>测试标题</div>
        //        </div>,
        headerRight: {
          slot: 'right'
        },
        // headerRight: () => <div>admin</div>,
        menuData: [
          {
            title: '菜单列表', // 标题
            icon: 'el-icon-s-goods', // icon
            auth: 'menu', // 权限
            path: '/menu', // 路径
            children: [ // 子菜单
              {
                title: '数据',
                auth: 'menu/data',
                path: '/menu/data'
              },
              {
                title: '分析',
                auth: 'menu/analysis',
                path: '/menu/analysis'
              }
            ]
          }
       ],
       headerStyles: {
         backgroundColor: '#545c64',
         padding: '10px',
         color: '#fff'
       },
       menuProps: {
         backgroundColor: '#f7f6f2',
         textColor: '#333',
         activeTextColor: '#409eff',
         defaultActive: '0-0',
         defaultOpeneds: [0]
       },
       triggerCollapse: true,
       footer: '@copyRight by footer', // 字符串或者render函数
    })
    return {
      settings,
      ...toRefs(settings)
    }
  }
})
</script>

<style>
.sum-layout {
   min-height: 500px;
}
.title {
  display: flex;
  align-items: center;
}
a:hover {
  text-decoration: none!important;
}
</style>
```

:::

### SumLayout Attributes

| 参数      | 说明          | 类型      | 可选值                           | 默认值  |
|---------- |-------------- |---------- |--------------------------------  |-------- |
| settings | 布局参数 | object | — | {} |

### Settings Attributes

| 参数      | 说明          | 类型      | 可选值                           | 默认值  |
|---------- |-------------- |---------- |--------------------------------  |-------- |
| headerTitle | 头栏左边内容 | string/object/function（如果有rener函数则展示render函数内容，如果是object,{slot: 'title'}则可以使用插槽，否则展示字符串） | — | {} |
| headerRight | 头栏右边内容 | string/object/function（如果有rener函数则展示render函数内容，如果是object,{slot: 'title'}则可以使用插槽，否则展示字符串） | — | {} |
| headerStyles | 头栏样式 | object | — | {} |
| menuProps | 侧栏属性传递（继承 el-menu 属性） | object | — | {} |
| triggerCollapse | 是否显示 collapse 图标 | boolean | — | false |
| menuData | 菜单数据 | array | — | [] |
| footer | 底部footer | string/object/function（如果有rener函数则展示render函数内容，如果是object,{slot: 'title'}则可以使用插槽，否则展示字符串） | — | {} |

### MenuProps Attributes

| 参数                | 说明                                                                                | 类型    | 可选值                | 默认值   |
| ------------------- | ----------------------------------------------------------------------------------- | ------- | --------------------- | -------- |
| mode                | 模式                                                                                | string  | horizontal / vertical | vertical |
| collapse            | 是否水平折叠收起菜单（仅在 mode 为 vertical 时可用）                                | boolean | —                     | false    |
| background-color    | 菜单的背景色（仅支持 hex 格式）                                                     | string  | —                     | #ffffff  |
| text-color          | 菜单的文字颜色（仅支持 hex 格式）                                                   | string  | —                     | #303133  |
| active-text-color   | 当前激活菜单的文字颜色（仅支持 hex 格式）                                           | string  | —                     | #409EFF  |
| default-active      | 当前激活菜单的 index                                                                | string  | —                     | —        |
| default-openeds     | 当前打开的 sub-menu 的 index 的数组                                                 | Array   | —                     | —        |
| unique-opened       | 是否只保持一个子菜单的展开                                                          | boolean | —                     | false    |
| menu-trigger        | 子菜单打开的触发方式(只在 mode 为 horizontal 时有效)                                | string  | hover / click         | hover    |
| router              | 是否使用 vue-router 的模式，启用该模式会在激活导航时以 index 作为 path 进行路由跳转 | boolean | —                     | false    |
| collapse-transition | 是否开启折叠动画                                                                    | boolean | —                     | true     |
