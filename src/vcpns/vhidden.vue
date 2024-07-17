<template>
    <div style="width:100%;display:inline-block;border:1px solid #ddd;border-radius:4px;padding:4px 8px;">
        <a-input style="display:none" v-model:value="value"></a-input>
        <span>
            <slot></slot>
        </span>
    </div>
</template>

<script setup>
let value = defineModel("value")
</script>