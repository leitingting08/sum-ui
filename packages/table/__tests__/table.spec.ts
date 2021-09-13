import { mount } from '@vue/test-utils'
import SumTable from '@sum-ui/table'

describe('@sum-ui/table', () => {
    it('create', () => {
        const wrapper = mount(SumTable)
        expect(wrapper.classes()).toContain('sum-table')
    })
})
