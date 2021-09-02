import { App } from 'vue'
import 'element-plus/theme-chalk/src/base.scss'
import Layout from './Index.vue'

Layout.install = (app: App): void => {
  app.component(Layout.name, Layout)
}

export default Layout