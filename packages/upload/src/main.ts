import { App } from 'vue'
import Upload from './Index.vue'

Upload.install = (app: App): void => {
  app.component(Upload.name, Upload)
}

export default Upload