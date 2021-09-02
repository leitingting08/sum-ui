import { mount } from '@vue/test-utils'
import SumLayout from '../src/Index.vue'

describe('@sum-ui/layout', () => {
  it('create', () => {
    const wrapper = mount(SumLayout)
    expect(wrapper.classes()).toContain('sum-layout')
  })
})
