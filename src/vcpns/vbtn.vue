<template>
    <a-button>
        <template #icon>
            <template v-if="props.btnType == 'add'">
                <Icon icon="mdi:add-bold" />
            </template>
            <template v-else-if="props.btnType == 'search'">
                <Icon icon="mingcute:search-fill" />
            </template>
            <template v-else-if="props.btnType == 'edit'">
                <Icon icon="basil:edit-outline" />
            </template>
            <template v-else-if="props.btnType == 'delete'">
                <Icon icon="material-symbols:delete-outline" />
            </template>
            <template v-else-if="props.btnType == 'lock'">
                <Icon icon="ic:outline-lock" />
            </template>
            <template v-else-if="props.btnType == 'unlock'">
                <Icon icon="mingcute:unlock-fill" />
            </template>
            <template v-else-if="props.btnType == 'refresh'">
                <Icon icon="mingcute:refresh-3-fill" />
            </template>
            <template v-else-if="props.btnType == 'save'">
                <Icon icon="carbon:save" />
            </template>
            <template v-else-if="props.btnType == 'cancel'">
                <Icon icon="basil:cancel-outline" />
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