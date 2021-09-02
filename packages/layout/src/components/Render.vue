<script>
import { defineComponent } from 'vue'

export default defineComponent({
  props: ['render', 'params'],
  setup(props) {
    return () => props.render(props.params)
  }
})
</script>

