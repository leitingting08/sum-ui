
/**
 * 全局注册组件 下文注释：重要、勿删，plop在自动新增组件的时候注入，不需要手动添加
 */
import { defineClientAppEnhance } from '@vuepress/client'
// -- APPSTART ITEMS HERE --
import SumTable from '@sum-ui/table'
import SumLayout from '@sum-ui/layout'

export default defineClientAppEnhance(({ app }) => {
  // -- APPEND ITEMS HERE --
app.component('SumTable', SumTable)
app.component('SumLayout', SumLayout)
})