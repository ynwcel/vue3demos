<template>
<a-config-provider :input="inputSetting" :form="formSetting"  :locale="zhCN">
    <RouterView />
</a-config-provider>
</template>

<script setup>
import zhCN from 'ant-design-vue/es/locale/zh_CN';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
dayjs.locale('zh-cn');

const inputSetting=reactive({
    'autocomplete':'off',
})
const formSetting=reactive({
    hideRequiredMark:true,
})
</script>