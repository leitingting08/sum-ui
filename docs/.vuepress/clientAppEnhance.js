
/**
 * 全局注册组件 下文注释：重要、勿删，plop在自动新增组件的时候注入，不需要手动添加
 */
import { defineClientAppEnhance } from '@vuepress/client'
import 'element-plus/theme-chalk/src/index.scss'
// -- APPSTART ITEMS HERE --
import SumUpload from '@sum-ui/upload'
import SumTable from '@sum-ui/table'
import SumLayout from '@sum-ui/layout'

export default defineClientAppEnhance(({ app }) => {
  // -- APPEND ITEMS HERE --
app.component('SumUpload', SumUpload)
app.component('SumTable', SumTable)
app.component('SumLayout', SumLayout)
})