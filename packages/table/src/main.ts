import { App } from 'vue'
import Table from './Index.vue'
import 'element-plus/theme-chalk/src/base.scss'

Table.install = (app: App): void => {
  app.component(Table.name, Table)
}

export default Table