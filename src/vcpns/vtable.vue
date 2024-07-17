<template>
    <a-table 
        bordered="1"
        :columns="columns" 
        :dataSource="props.rows"
        :row-selection="props.selection"
        :row-key="props.rowkey || 'id'"

        :pagination="pageinfo"
        @change="vfuncs.changed" 
        :scroll="scorlls"
        v-bind="$attrs"
        size="middle"
        sticky
        emptyText="暂无内容"
    >
        <template #bodyCell="{text, record, index, column}">
            <slot name="bodyCell" :text="text" :record="record" :index="index" :column="column"></slot>
        </template>
        <template #footer="currentPageData">
            <slot name="footer" :currentPageData="currentPageData"></slot>
        </template>
        <template #summary>
            <slot name="summary"></slot>
        </template>
    </a-table>
</template>

<script setup>
import{util} from '@/helper'
import { computed } from 'vue';
//定义加载事件
const emits = defineEmits(['load']);
//定义列属性
const props = defineProps({
    rows:{
        type:Array
    },
    rowkey:{
        type:String
    },
    columns:{
        type:Array,
    },
    page:{
        type:Object
    },
    selection:{
        type:Object
    }
})

//路由更新
onMounted(()=>{
    vfuncs.refresh();
})

//计算 列属性
let columns = computed(()=>{
    if(util.docWidth()>util.breakpoints('md')){
        return props.columns;
    }
    let breakpoint_columns = [];
    for (let idx in props.columns) {
        let col = props.columns[idx];
        if(typeof(col['width'])=='undefined'){
            col.minWidth = 200;
        }
        breakpoint_columns.push(col);
    }
    console.log(breakpoint_columns);
    return breakpoint_columns
})
//计算 滚动属性
let scorlls = computed(()=>{
    if (util.docWidth() > util.breakpoints('md')) {
        return {}
    }
    let scorll_width = 0;
    let columns = props.columns;
    for(let col of columns){
        if (typeof (col['width']) == 'number') {
            scorll_width += parseInt(col.width);
        }else if(typeof(col['minWidth'])=='number'){
            scorll_width += parseInt(col.minWidth);
        }else{
            scorll_width += 200;
        }
    }
    return {x: scorll_width }
})

//计算 分页属性
let pageinfo = computed(()=>{
    if(typeof(props.page)=='undefined' || !props.page ){
        return false
    }else{
        const p =  {
            current:props.page.pidx,
            pageSize:props.page.psize,
            total:props.page.rcount,
            pageSizeOptions:Array.from(new Set([props.page.psize,1,30,50,99])).sort(),
            showSizeChanger:true,
            showQuickJumper:true,
            size:"middle"
        }
        return p;
    }
})
let vfuncs = {
    refresh:(pidx,psize)=>{
        emits('load',pidx,psize);
    },
    
    changed:(pageinfo,filters,sort)=>{
        vfuncs.refresh(pageinfo.current,pageinfo.pageSize);
    }
}
</script>

<style>
div.ant-pagination-options-size-changer{
    min-width:5rem!important;
}
</style>