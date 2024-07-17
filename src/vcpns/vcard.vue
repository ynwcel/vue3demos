<template>
    <div class="vcard-wrap">
        <a-card>
            <div class="card-filter-block">
                <slot name="filter"></slot>
            </div>
            <div class="card-chart-block">
                <slot name="chart"></slot>
            </div>
            <div class="card-table-block">
                <slot name="table"></slot>
            </div>
        </a-card>
        <a-drawer :title="props.drawTitle" v-model:open="draw_show" placement="right" :maskClosable="false" :width="drawWidth">
            <slot name="drawer">

            </slot>
        </a-drawer>
    </div>
</template>

<script setup>
import {util} from '@/helper';
const draw_show = defineModel("drawShow");
const props = defineProps({
    drawTitle:{
        type:String,
        default:'创建/编辑'
    }
})

const drawWidth = computed(()=>{
    return util.fwidth(800);
})

</script>