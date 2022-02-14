---
title: 'Table'
desc: 'desc'
---

### @sum-ui/table

::: demo

```vue
<template>
  <sum-table 
    border
    :columns="columns"
    :data="tableData"
    :pagenation="pagenation"
    @pagenation-change="handlePagenationChange"
    @select-change="handleSelectionChange"
  >
   <template #operation="scope">
      <span @click="removeItem(scope.row)" style="cursor:pointer;color:#409eff"> 删除 </span>
    </template>
  </sum-table >
</template>

<script lang="ts">
import { defineComponent, ref, reactive } from 'vue'

export default defineComponent({
  setup() {
    const columns = ref([
      {
        type: 'selection',
        width: 60
      },
      {
        label: '媒体ID',
        prop: 'id'
      },
      {
        label: '媒体名称',
        prop: 'appName'
      },
      {
        label: '操作',
        slot: 'operation'
      }
    ])

    const tableData = ref([
      {id: 1, appName: '媒体1'},
      {id: 2, appName: '媒体2'},
      {id: 3, appName: '媒体3'},
      {id: 4, appName: '媒体4'},
      {id: 5, appName: '媒体5'}
    ])
    const pagenation = reactive({
      currentPage: 1,
      pageSize: 10,
      total: 100,
      background: true,
      layout: 'total, sizes, prev, pager, next, jumper'
    })
    const handlePagenationChange = (data) => {
       console.log(data)
    }

    const handleSelectionChange = (data) => {
      console.log(data)
    }

    // 单个删除
    const removeItem = (row) => {
      // 执行删除操作
      console.log('删除', row, row.id)
    }
    return {
      columns,
      tableData,
      pagenation,
      handlePagenationChange,
      handleSelectionChange,
      removeItem
    }
  }
})
</script>

```

:::

### SumTable Attributes

属性除继承自 el-table属性外，增加 columns配置，locale 语言配置，默认中文， pagenation 分页属性配置

| 参数                    | 说明                                                                                                                                                                                                        | 类型                                                      | 可选值                          | 默认值                                                        |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------- | ------------------------------- | ------------------------------------------------------------- |
| columns                    | columns 配置                                                                                                                                                                                                  | array                                                     |
| data                    | 显示的数据                                                                                                                                                                                                  | array                                                     | —                               | —                                                             |
| height                  | Table 的高度，默认为自动高度。如果 height 为 number 类型，单位 px；如果 height 为 string 类型，则这个高度会设置为 Table 的 style.height 的值，Table 的高度会受控于外部样式。                                | string / number                                           | —                               | —                                                             |
| max-height              | Table 的最大高度。合法的值为数字或者单位为 px 的高度。                                                                                                                                                      | string / number                                           | —                               | —                                                             |
| stripe                  | 是否为斑马纹 table                                                                                                                                                                                          | boolean                                                   | —                               | false                                                         |
| border                  | 是否带有纵向边框                                                                                                                                                                                            | boolean                                                   | —                               | false                                                         |
| size                    | Table 的尺寸                                                                                                                                                                                                | string                                                    | medium / small / mini           | —                                                             |
| fit                     | 列的宽度是否自撑开                                                                                                                                                                                          | boolean                                                   | —                               | true                                                          |
| show-header             | 是否显示表头                                                                                                                                                                                                | boolean                                                   | —                               | true                                                          |
| highlight-current-row   | 是否要高亮当前行                                                                                                                                                                                            | boolean                                                   | —                               | false                                                         |
| current-row-key         | 当前行的 key，只写属性                                                                                                                                                                                      | string / number                                           | —                               | —                                                             |
| row-class-name          | 行的 className 的回调方法，也可以使用字符串为所有行设置一个固定的 className。                                                                                                                               | function({ row, rowIndex }) / string                      | —                               | —                                                             |
| row-style               | 行的 style 的回调方法，也可以使用一个固定的 Object 为所有行设置一样的 Style。                                                                                                                               | function({ row, rowIndex }) / object                      | —                               | —                                                             |
| cell-class-name         | 单元格的 className 的回调方法，也可以使用字符串为所有单元格设置一个固定的 className。                                                                                                                       | function({ row, column, rowIndex, columnIndex }) / string | —                               | —                                                             |
| cell-style              | 单元格的 style 的回调方法，也可以使用一个固定的 Object 为所有单元格设置一样的 Style。                                                                                                                       | function({ row, column, rowIndex, columnIndex }) / object | —                               | —                                                             |
| header-row-class-name   | 表头行的 className 的回调方法，也可以使用字符串为所有表头行设置一个固定的 className。                                                                                                                       | function({ row, rowIndex }) / string                      | —                               | —                                                             |
| header-row-style        | 表头行的 style 的回调方法，也可以使用一个固定的 Object 为所有表头行设置一样的 Style。                                                                                                                       | function({ row, rowIndex }) / object                      | —                               | —                                                             |
| header-cell-class-name  | 表头单元格的 className 的回调方法，也可以使用字符串为所有表头单元格设置一个固定的 className。                                                                                                               | function({ row, column, rowIndex, columnIndex }) / string | —                               | —                                                             |
| header-cell-style       | 表头单元格的 style 的回调方法，也可以使用一个固定的 Object 为所有表头单元格设置一样的 Style。                                                                                                               | function({ row, column, rowIndex, columnIndex }) / object | —                               | —                                                             |
| row-key                 | 行数据的 Key，用来优化 Table 的渲染；在使用 reserve-selection 功能与显示树形数据时，该属性是必填的。类型为 String 时，支持多层访问：`user.info.id`，但不支持 `user.info[0].id`，此种情况请使用 `Function`。 | function(row) / string                                    | —                               | —                                                             |
| empty-text              | 空数据时显示的文本内容，也可以通过 `#empty` 设置                                                                                                                                                            | string                                                    | —                               | 暂无数据                                                      |
| default-expand-all      | 是否默认展开所有行，当 Table 包含展开行存在或者为树形表格时有效                                                                                                                                             | boolean                                                   | —                               | false                                                         |
| expand-row-keys         | 可以通过该属性设置 Table 目前的展开行，需要设置 row-key 属性才能使用，该属性为展开行的 keys 数组。                                                                                                          | array                                                     | —                               | —                                                             |
| default-sort            | 默认的排序列的 prop 和顺序。它的 `prop` 属性指定默认的排序的列，`order` 指定默认排序的顺序                                                                                                                  | object                                                    | `order`: ascending / descending | 如果只指定了 `prop`, 没有指定 `order`, 则默认顺序是 ascending |
| tooltip-effect          | tooltip `effect` 属性                                                                                                                                                                                       | string                                                    | dark / light                    | dark                                                          |
| show-summary            | 是否在表尾显示合计行                                                                                                                                                                                        | boolean                                                   | —                               | false                                                         |
| sum-text                | 合计行第一列的文本                                                                                                                                                                                          | string                                                    | —                               | 合计                                                          |
| summary-method          | 自定义的合计计算方法                                                                                                                                                                                        | function({ columns, data })                               | —                               | —                                                             |
| span-method             | 合并行或列的计算方法                                                                                                                                                                                        | function({ row, column, rowIndex, columnIndex })          | —                               | —                                                             |
| select-on-indeterminate | 在多选表格中，当仅有部分行被选中时，点击表头的多选框时的行为。若为 true，则选中所有行；若为 false，则取消选择所有行                                                                                         | boolean                                                   | —                               | true                                                          |
| indent                  | 展示树形数据时，树节点的缩进                                                                                                                                                                                | number                                                    | —                               | 16                                                            |
| lazy                    | 是否懒加载子节点数据                                                                                                                                                                                        | boolean                                                   | —                               | —                                                             |
| load                    | 加载子节点数据的函数，lazy 为 true 时生效，函数第二个参数包含了节点的层级信息                                                                                                                               | function(row, treeNode, resolve)                          | —                               | —                                                             |
| tree-props              | 渲染嵌套数据的配置选项                                                                                                                                                                                      | object                                                    | —                               | { hasChildren: 'hasChildren', children: 'children' }          |
| locale              |  语言属性                                                                                                                                                                                     | object                                                    | —                               | import zhCn from 'element-plus/lib/locale/lang/zh-cn'         |
| pagenation              |  分页属性                                                                                                                                                                                     | object                                                    | —                               | {}          |

### Pagenation Attributes

继承自 el-pagenation 属性配置

| 参数               | 说明                                                     | 类型              | 可选值      | 默认值 |
|--------------------|----------------------------------------------------------|-------------------|-------------|--------|
| small | 是否使用小型分页样式 | boolean | — | false |
| background | 是否为分页按钮添加背景色 | boolean | — | false |
| page-size | 每页显示条目个数，支持 v-model 双向绑定 | number | — | 10 |
| default-page-size | 每页显示条目数的初始值；| number | - | - |
| total | 总条目数 | number | — | — |
| page-count | 总页数，total 和 page-count 设置任意一个就可以达到显示页码的功能；如果要支持 page-sizes 的更改，则需要使用 total 属性 | Number | — | — |
| pager-count | 页码按钮的数量，当总页数超过该值时会折叠 | number | 大于等于 5 且小于等于 21 的奇数 | 7 |
| current-page | 当前页数，支持 v-model 双向绑定 | number | — | 1 |
| default-current-page | 当前页数的初始值 | number | - | - |
| layout | 组件布局，子组件名用逗号分隔| String | `sizes`, `prev`, `pager`, `next`, `jumper`, `->`, `total`, `slot` | 'prev, pager, next, jumper, ->, total'  |
| page-sizes | 每页显示个数选择器的选项设置 | number[] | — |  [10, 20, 30, 40, 50, 100] |
| popper-class | 每页显示个数选择器的下拉框类名 | string | — | — |
| prev-text | 替代图标显示的上一页文字 | string | — | — |
| next-text | 替代图标显示的下一页文字 | string | — | — |
| disabled | 是否禁用 | boolean | — | false |
| hide-on-single-page | 只有一页时是否隐藏 | boolean | — | - |

### Events

| 事件名称 | 说明 | 回调参数 |
|---------|--------|---------|
| pagenation-change | pageSize/currentPage 改变时会触发参数变化 | pagenation对象 |
| select-change | 选中checkbox时会触发 | 选中row数组 |
