import { mount } from '@vue/test-utils'
import SumLayout from '@sum-ui/layout'

describe('@sum-ui/layout', () => {
    it('create', () => {
        const wrapper = mount(SumLayout)
        expect(wrapper.classes()).toContain('sum-layout')
    })
})
