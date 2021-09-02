import { mount } from '@vue/test-utils'
import SumTable from '../src/Index.vue'

describe('@sum-ui/table', () => {
  it('create', () => {
    const wrapper = mount(SumLayout)
    expect(wrapper.classes()).toContain('sum-table')
  })
})
