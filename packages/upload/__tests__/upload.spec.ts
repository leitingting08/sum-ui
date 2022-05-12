import { mount } from '@vue/test-utils'
import SumUpload from '@sum-ui/upload'

describe('@sum-ui/upload', () => {
  it('create', () => {
    const wrapper = mount(SumUpload)
    expect(wrapper.classes()).toContain('sum-upload')
  })
})
