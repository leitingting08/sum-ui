import { App } from 'vue'
import Layout from './Index.vue'
import 'element-plus/theme-chalk/src/index.scss'

Layout.install = (app: App): void => {
    app.component(Layout.name, Layout)
}

export default Layout
