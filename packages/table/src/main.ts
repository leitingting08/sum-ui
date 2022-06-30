import { App } from 'vue'
import Table from './Index.vue'
import '../../../main.css'

Table.install = (app: App): void => {
    app.component(Table.name, Table)
}

export default Table
