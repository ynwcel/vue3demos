<template>
    <vcard v-model:draw-show="vdatas.draw_show">
        <template #filter>
            <a-form :model="vdatas.filter" layout="inline" autocomplete="off" @finish="vfuncs.loadData">
                <a-form-item>
                    <a-space>
                        <vbtn type="default" html-type="button" @click="vfuncs.showAddForm" btn-type="add">创建</vbtn>
                    </a-space>
                </a-form-item>
            </a-form>
        </template>

        <template #table>
            <vtable v-bind="vdatas.vtable" @load="vfuncs.loadData" v-model:expandedRowKeys="vdatas.vtable.expandedRowKeys">
                <template #bodyCell="{ text, record, index, column }">
                    <template v-if="column.dataIndex == 'typeid'">
                        <a-space>
                            <template v-if="record.typeid == 1">
                                <a-tag color="green">功能菜单</a-tag>
                            </template>
                            <template v-else>
                                <a-tag color="orange">接口地址</a-tag>
                            </template>
                        </a-space>
                    </template>
                    <template v-if="column.dataIndex == 'state'">
                        <a-space>
                            <template v-if="record.is_show">
                                <a-tag color="green">显示</a-tag>
                            </template>
                            <template v-else>
                                <a-tag color="orange">隐藏</a-tag>
                            </template>
                        </a-space>
                    </template>
                    <template v-if="column.dataIndex == 'action'">
                        <a-space>
                            <vbtn btn-type="edit" size="small" @click="vfuncs.showEditForm(record)">编辑</vbtn>
                            <a-popconfirm title="确定删除此菜单" @confirm="vfuncs.delete([record.id])">
                                <vbtn btn-type="delete" size="small" danger>删除</vbtn>
                            </a-popconfirm>
                        </a-space>
                    </template>
                </template>
                <template #footer>
                    <a-space wrap="wrap">
                        <a-popconfirm title="确定显示所选菜单" @confirm="vfuncs.put('show', [])">
                            <vbtn :disabled="vdatas.vtable.rowSelection.selectedRowKeys.length <= 0" btn-type="unlock">批量显示</vbtn>
                        </a-popconfirm>
                        <a-popconfirm title="确定隐藏所选菜单" @confirm="vfuncs.put('hide', [])">
                            <vbtn :disabled="vdatas.vtable.rowSelection.selectedRowKeys.length <= 0" btn-type="lock">批量隐藏</vbtn>
                        </a-popconfirm>
                    </a-space>
                </template>
            </vtable>
        </template>

        <template #drawer>
            <a-spin :spinning="vdatas.draw_sping">
                <a-form :model="vdatas.edit" autocomplete="off" @finish="vfuncs.post">
                    <a-form-item label="父菜单" name="pid" :rules="[{ required: true, message: '' }]">
                        <a-select v-model:value="vdatas.edit.pid" show-search :filterOption="vfuncs.searchEditPid">
                            <a-select-option label="根菜单" :value="0">根菜单</a-select-option>
                            <template v-for="(m, idx) of vdatas.vtable.dataSource" :key="idx">
                                <a-select-option :label="m.title" :value="m.id">{{ m.title }}</a-select-option>
                                <a-select-option v-for="(subm, subidx) of m.children" :key="100 * (idx + 1) + subidx" :label="subm.title" :value="subm.id">&nbsp;&nbsp;&nbsp;&nbsp;|--{{ subm.title }}</a-select-option>
                            </template>

                        </a-select>
                    </a-form-item>

                    <a-form-item label="菜单名称" name="title" :rules="[{ required: true, message: '' }]">
                        <a-input v-model:value="vdatas.edit.title"></a-input>
                    </a-form-item>

                    <a-form-item label="连接地址" name="href" :rules="[{ required: true, message: '' }]">
                        <a-input v-model:value="vdatas.edit.href"></a-input>
                    </a-form-item>
                    
                    <a-form-item label="视图路径" name="view" :rules="[{ required: true, message: '' }]">
                        <a-input v-model:value="vdatas.edit.view"></a-input>
                    </a-form-item>

                    <a-form-item label="菜单类型" name="typeid" :rules="[{ required: true, message: '' }]">
                        <a-select v-model:value="vdatas.edit.typeid">
                            <a-select-option :value="1">功能菜单</a-select-option>
                            <a-select-option :value="2">接口地址</a-select-option>
                        </a-select>
                    </a-form-item>

                    <a-form-item label="菜单状态" name="is_show" :rules="[{ required: true, message: '' }]">
                        <a-select v-model:value="vdatas.edit.is_show">
                            <a-select-option :value="1">显示</a-select-option>
                            <a-select-option :value="0">隐藏</a-select-option>
                        </a-select>
                    </a-form-item>

                    <a-form-item label="菜单排序" name="orders" :rules="[{ required: true, message: '' }]">
                        <a-input-number v-model:value="vdatas.edit.orders" style="width:100%;"></a-input-number>
                    </a-form-item>

                    <a-form-item>
                        <a-flex justify="center" gap="large">
                            <vbtn btn-type="save" type="primary" html-type="submit">保存</vbtn>
                            <vbtn btn-type="cancel" html-type="button" @click="vdatas.draw_show = false">取消</vbtn>
                        </a-flex>
                    </a-form-item>
                </a-form>
            </a-spin>
        </template>
    </vcard>
</template>


<script setup>
import * as api from '@/api'

let vdatas = reactive({
    edit: {
        id: 0,
        pid: 0,
        title: '',
        view:"",
        href: '',
        typeid:1,
        is_show: 1,
        orders: 1000000,
    },
    draw_show: false,
    draw_sping: false,
    vtable: {
        columns: [
            { title: '标题', dataIndex: 'title', key: 'title' },
            { title: '连接地址', dataIndex: 'href', align: 'left' },
            { title: '视图路径', dataIndex: 'view', align: 'left' },
            { title: '类型', dataIndex: 'typeid', key: 'typeid', align: 'center' },
            { title: '状态', dataIndex: 'state', align: 'center' },
            { title: '排序', dataIndex: 'orders', align: 'center' },
            { title: '创建时间', dataIndex: 'add_time', align: 'center', width: 160  },
            { title: '操作', dataIndex: 'action', align: 'center', width: 160  }
        ],
        loading: false,
        expandedRowKeys: [],
        dataSource: [],
        rowSelection: {
            checkStrictly: false,
            selectedRowKeys: [],
            onChange: (selectedRowKeys, selectedRows) => {
                vdatas.vtable.rowSelection.selectedRowKeys = selectedRowKeys;
            }
        },
        hide_footer: false,
    }
})
let vfuncs = {
    loadData: async () => {
        vdatas.vtable.loading = true;
        let result = await api.admin.getActions();
        if (result.flag) {
            let tree = vfuncs.rows2tree(result.data);
            vdatas.vtable.dataSource = tree;
            vdatas.vtable.expandedRowKeys = tree.map((r) => r.id);
        }
        vdatas.vtable.loading = false;
    },
    showAddForm: async () => {
        vdatas.edit = {
            id: 0,
            pid: 0,
            title: '',
            href: '',
            typeid: 1,
            is_show: 1,
            orders: 1000000,
        }
        vdatas.draw_show = true;
        vdatas.draw_sping = false;
        console.log(vdatas);
    },
    showEditForm: async (record) => {
        vdatas.edit = Object.assign({}, record);
        vdatas.draw_show = true;
        vdatas.draw_sping = false;
    },
    post: async () => {
        vdatas.draw_sping = true;
        let result = await api.admin.postActions(vdatas.edit);
        vdatas.draw_sping = false;
        if (result.flag) {
            vfuncs.loadData();
            vdatas.draw_show = false;
        }
    },
    delete: async (ids) => {
        ids = ids.length <= 0 ? vdatas.vtable.rowSelection.selectedRowKeys : ids;
        let result = await api.admin.deleteActions({ ids: ids, act: 'delete' });
        if (result.flag) {
            vfuncs.loadData();
            vdatas.draw_show = false;
        }
    },
    put: async (act, ids) => {
        ids = ids.length <= 0 ? vdatas.vtable.rowSelection.selectedRowKeys : ids;
        let resule = await api.admin.putActions({ act: act, ids: ids })
        if (resule.flag) {
            vfuncs.loadData();
        }
    },
    searchEditPid: (input, option) => {
        return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
    },
    rows2tree:(data,pid_key="pid")=>{
        let result = new Array();
        for(let i=0;i<data.length;i++){
            let row = data[i];
            if(row[pid_key]!=0){
                continue;
            }
            row.children = [];
            for(let j=0;j<data.length;j++){
                let row_j = data[j];
                if(row.id == row_j[pid_key]){
                    row.children.push(row_j);
                }
            }
            result.push(row);
        }
        return result;
    }
}
</script>