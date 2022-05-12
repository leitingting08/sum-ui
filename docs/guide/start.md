---
title: 开始
---

## 安装

```bash
npm i @sum-ui/layout
# or
yarn add @sum-ui/layout

npm i @sum-ui/table
# or
yarn add @sum-ui/table
```

## 使用

```vue
<template>
    <sum-layout>
        <sum-table />
    </sum-layout>
</template>

<script lang="ts">
import { defineComponent, toRefs } from 'vue'
import SumLayout from '@sum-ui/layout'
import SumTable from '@sum-ui/table'
import SumUpload from '@sum-ui/upload'

export default defineComponent({
    name: 'sum-layout',
    components: { SumLayout, SumTable, SumUpload },
    setup() {}
})
</script>
```
