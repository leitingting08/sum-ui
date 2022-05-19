<template>
    <div class="sum-table">
        <el-config-provider :locale="!lang ? locale : zhCn">
            <el-table :data="data" v-if="data" v-bind="props" @selection-change="handleSelectionChange">
                <template v-for="(column, index) in columns" :key="index">
                    <el-table-column v-bind="column || {}">
                        <template v-if="column?.slot" #default="scope">
                            <slot :name="column.slot" :row="scope.row" :column="column" :index="index" />
                        </template>
                        <template v-else-if="column?.render" #default="scope">
                            <render :render="column.render" :params="{ row: scope.row, column, index }" />
                        </template>
                    </el-table-column>
                </template>
            </el-table>
            <el-pagination
                v-if="data && pagenation?.total"
                v-bind="pagenation"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
            >
            </el-pagination>
        </el-config-provider>
        <button type="button" class="py-2 px-4 bg-red-500 text-white font-semibold rounded-lg shadow-md">button</button>
        <span class="text-gray-700 hover:text-primary">I am a span</span>
    </div>
</template>

<script lang="ts">
import { ElTable, ElTableColumn, ElPagination, ElConfigProvider } from 'element-plus'
import { defineComponent, toRefs } from 'vue'
import zhCn from 'element-plus/lib/locale/lang/zh-cn'
import Render from './components/Render.vue'
import isEmpty from 'lodash/isEmpty'

export default defineComponent({
    name: 'SumTable',
    components: { ElTable, ElTableColumn, ElPagination, Render, ElConfigProvider },
    props: {
        ...ElTable.props,
        ...{
            columns: {
                type: Array,
                default: []
            },
            pagenation: {
                type: Object,
                default: () => ({
                    pageSize: 10,
                    currentPage: 1,
                    total: 0
                })
            },
            locale: {
                type: Object,
                default: {}
            }
        }
    },
    setup(props, { emit }) {
        const { pagenation, columns, data, locale } = toRefs(props)
        const lang = isEmpty(locale.value)

        const handleSelectionChange = (datas: []) => {
            emit('select-change', datas)
        }
        const handleSizeChange = (val: [number, string]) => {
            pagenation.value.pageSize = val
            emit('pagenation-change', pagenation.value)
        }
        const handleCurrentChange = (val: [number, string]) => {
            pagenation.value.currentPage = val
            emit('pagenation-change', pagenation.value)
        }
        return {
            lang,
            locale,
            zhCn,
            props,
            columns,
            data,
            pagenation,
            handleSelectionChange,
            handleSizeChange,
            handleCurrentChange
        }
    }
})
</script>

<style lang="scss">
table {
    margin: 0;
}
th,
td {
    border: none;
}
.el-pagination {
    display: flex;
    justify-content: flex-end;
    margin: 10px 0;
}
</style>
