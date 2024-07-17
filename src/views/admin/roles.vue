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
            <vtable v-bind="vdatas.vtable" @load="vfuncs.loadData">
                <template #bodyCell="{ text, record, index, column }">
                    <template v-if="column.dataIndex == 'action'">
                        <a-space>
                            <vbtn size="small" btn-type="edit" @click="vfuncs.showEditForm(record)">编辑</vbtn>
                            <a-popconfirm title="确定要删除此角色" @confirm="vfuncs.delete([record.id])">
                                <vbtn size="small" btn-type="delete" danger>删除</vbtn>
                            </a-popconfirm>
                        </a-space>
                    </template>
                </template>
            </vtable>
        </template>
        <template #drawer>
            <a-spin :spinning="vdatas.edit_sping">
                <a-form :model="vdatas.edit" autocomplete="off" @finish="vfuncs.post">
                    <a-form-item label="角色名称" name="title" :rules="[{ required: true, message: '' }]">
                        <a-input v-model:value="vdatas.edit.title"></a-input>
                    </a-form-item>

                    <a-form-item label="操作列表" :rules="[{ required: true, message: '' }]">
                        <vtable v-bind="vdatas.edit_actions">
                            
                        </vtable>
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
import * as api from '@/api';

const vdatas = reactive({
    edit: {
        id: 0,
        title: '',
        actions: [],
    },
    vtable: {
        columns: [
            { title: '角色名', dataIndex: 'title', align: 'center'},
            { title: '创建时间', dataIndex: 'add_time', align: 'center', width: 160  },
            { title: '操作', dataIndex: 'action', align: 'left', width: 160 }
        ],
        loading: false,
        dataSource: [],
        rowSelection: {
            checkStrictly: false,
            selectedRowKeys: [],
            onChange: (selectedRowKeys, selectedRows) => {
                vdatas.vtable.rowSelection.selectedRowKeys = selectedRowKeys;
            }
        },
    },
    edit_actions: {
        columns: [
            { title: '菜单名称', dataIndex: 'title' },
            { title: '连接地址', dataIndex: 'href' },
        ],
        dataSource: [],
        rowSelection: {
            checkStrictly: false,
            selectedRowKeys: [],
            onChange: (selectedRowKeys, selectedRows) => {
                vdatas.edit_actions.rowSelection.selectedRowKeys = selectedRowKeys;
                vdatas.edit.actions = selectedRowKeys;
            }
        },
    },
    action_pids:{},
    draw_show: false,
})
const vfuncs = {
    loadActions: async () => {
        let result = await api.admin.getActions(vdatas.filter);
        if (result.flag) {
            let tree = vfuncs.rows2tree(result.data);
            vdatas.edit_actions.dataSource = tree;
            vdatas.edit_actions.expandedRowKeys = tree.map((r) => r.id);
            vdatas.action_pids = new Set(result.data.map((v)=>v.pid));
        }
    },
    loadData: async () => {
        vdatas.vtable.loading = true;
        let result = await api.admin.getRoles(vdatas.filter);
        vdatas.vtable.loading = false;
        if (result.flag) {
            vdatas.vtable.dataSource = result.data
        }
    },
    search: async () => {
        return vfuncs.loadData();
    },
    showAddForm: async () => {
        vdatas.draw_show = true;
        vdatas.edit = {
            id: 0,
            title: '',
            actions: [],
        }
        vdatas.edit_actions.rowSelection.selectedRowKeys = [];
        await vfuncs.loadActions();
        vdatas.edit_sping = false;

    },
    showEditForm: async (record) => {
        vdatas.draw_show = true;
        vdatas.edit = Object.assign({}, record);
        await vfuncs.loadActions();
        let edit_actions = record.actions.split(',').map((v) => parseInt(v)).filter((v) => !vdatas.action_pids.has(v))
        vdatas.edit.actions = edit_actions;
        vdatas.edit_actions.rowSelection.selectedRowKeys = edit_actions
        vdatas.edit_sping = false;
    },
    post: async (values) => {
        let params = Object.assign(vdatas.edit,values)
        if(params.actions.length<=0){
            util.msg.fail('操作列表不能为空');
            return;
        }
        vdatas.edit_sping = true;
        let result = await api.admin.postRoles(params);
        vdatas.edit_sping = false;
        if (result.flag) {
            vdatas.draw_show = false;
            vfuncs.loadData()
        }
    },
    delete: async (ids) => {
        ids = ids.length <= 0 ? vdatas.vtable.rowSelection.selectedRowKeys : ids;
        let resule = await api.admin.deleteRoles({ act: 'delete', ids: ids })
        if (resule.flag) {
            vfuncs.loadData();
        }
    },
    rows2tree: (data, pid_key = "pid") => {
        let result = new Array();
        for (let i = 0; i < data.length; i++) {
            let row = data[i];
            if (row[pid_key] != 0) {
                continue;
            }
            row.children = [];
            for (let j = 0; j < data.length; j++) {
                let row_j = data[j];
                if (row.id == row_j[pid_key]) {
                    row.children.push(row_j);
                }
            }
            result.push(row);
        }
        return result;
    },
    row2Map:(data,id_key="id")=>{
        let result = {}
        data.forEach(v=>{
            result[v[id_key]] = v;
        })
        return result;
    }
}
</script>