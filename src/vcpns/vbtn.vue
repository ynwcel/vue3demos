<template>
    <a-button>
        <template #icon>
            <template v-if="props.btnType == 'add'">
                <Iconify icon="mdi:add-bold" />
            </template>
            <template v-else-if="props.btnType == 'search'">
                <Iconify icon="mingcute:search-fill" />
            </template>
            <template v-else-if="props.btnType == 'edit'">
                <Iconify icon="basil:edit-outline" />
            </template>
            <template v-else-if="props.btnType == 'delete'">
                <Iconify icon="material-symbols:delete-outline" />
            </template>
            <template v-else-if="props.btnType == 'lock'">
                <Iconify icon="ic:outline-lock" />
            </template>
            <template v-else-if="props.btnType == 'unlock'">
                <Iconify icon="mingcute:unlock-fill" />
            </template>
            <template v-else-if="props.btnType == 'refresh'">
                <Iconify icon="mingcute:refresh-3-fill" />
            </template>
            <template v-else-if="props.btnType == 'save'">
                <Iconify icon="carbon:save" />
            </template>
            <template v-else-if="props.btnType == 'cancel'">
                <Iconify icon="basil:cancel-outline" />
            </template>

        </template>
        <slot name="default"></slot>
    </a-button>
</template>


<script setup>
const props = defineProps({
    btnType:String
})
</script>