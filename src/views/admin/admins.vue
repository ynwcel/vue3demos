<template>
    <vcard v-model:draw-show="vdatas.draw_show">
        <template #filter>
            <a-form :model="vdatas.filter" layout="inline" autocomplete="off" @finish="vfuncs.search">
                <a-form-item label="姓名:" name="fname">
                    <a-input v-model:value="vdatas.filter.fname"></a-input>
                </a-form-item>

                <a-form-item label="电话:" name="fphone">
                    <a-input v-model:value="vdatas.filter.fphone"></a-input>
                </a-form-item>

                <a-form-item>
                    <a-space>
                        <vbtn type="primary" html-type="submit" btn-type="search">查询</vbtn>
                        <vbtn type="default" html-type="button" @click="vfuncs.showAddForm" btn-type="add">创建</vbtn>
                    </a-space>
                </a-form-item>
            </a-form>
        </template>
        <template #table>
            <vtable v-bind="vdatas.vtable" @load="vfuncs.loadData">
                <template #bodyCell="{ text, record, index, column }">
                    <template v-if="column.dataIndex=='role_id'">
                        <a-tag color="green">{{ vdatas.roles[record.role_id] }}</a-tag>
                    </template>
                    <template v-if="column.dataIndex == 'action'">
                        <a-space>
                            <vbtn size="small" btn-type="edit" @click="vfuncs.showEditForm(record)">编辑</vbtn>
                            <a-popconfirm :title="`确定重置密码为:${record.phone}@${new Date().getFullYear()}`" @confirm="vfuncs.put('resetpwd', [record.id])">
                                <vbtn size="small"  btn-type="lock">重置密码</vbtn>
                            </a-popconfirm>
                            <a-popconfirm title="确定要删除此账号" @confirm="vfuncs.delete([record.id])">
                                <vbtn size="small" btn-type="delete" danger>删除</vbtn>
                            </a-popconfirm>
                        </a-space>
                    </template>
                </template>
            </vtable>
        </template>
        <template #drawer>
            <a-spin :spinning="vdatas.edit_sping">
                <a-form :model="vdatas.edit" autocomplete="off" @finish="vfuncs.post" hideRequiredMark>
                    <a-form-item label="电话号码" name="phone" :rules="[{ required: true, message: '' }]">
                        <a-input v-model:value="vdatas.edit.phone" :disabled="vdatas.edit.id > 0"></a-input>
                    </a-form-item>

                    <template v-if="vdatas.edit.id <= 0">
                        <a-form-item label="初始密码" name="password">
                            <a-input v-model:value="getDefaultPwd" disabled></a-input>
                        </a-form-item>
                    </template>

                    <a-form-item label="真实姓名" name="real_name" :rules="[{ required: true, message: '' }]">
                        <a-input v-model:value="vdatas.edit.real_name"></a-input>
                    </a-form-item>

                    <a-form-item label="所属角色" name="role_id" :rules="[{ required: true, message: '' }]">
                        <a-select v-model:value="vdatas.edit.role_id">
                            <a-select-option v-for="(role_name, role_id) of vdatas.roles" :key="role_id" :value="role_id">{{ role_name }}</a-select-option>
                        </a-select>
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

const getDefaultPwd = computed(() => {

    return vdatas.edit.phone ? vdatas.edit.phone + "@" + ((new Date()).getFullYear()) : '';
})

const vdatas = reactive({
    filter: {
        fname: '',
        fphone: '',
    },
    roles:{},
    edit: {
        id: 0,
        phone: "",
        real_name: "",
        role_id: 0,
    },
    vtable: {
        columns: [
            { title: '电话号码', dataIndex: 'phone', align: 'center' },
            { title: '真实姓名', dataIndex: 'real_name', align: 'center' },
            { title: '所属角色', dataIndex: 'role_id', align: 'center' },
            { title: '最后登录IP', dataIndex: 'login_ip', align: 'center' },
            { title: '最后登录时间', dataIndex: 'login_time', align: 'center' },
            { title: '创建时间', dataIndex: 'add_time', align: 'center', width: 160  },
            { title: '操作', dataIndex: 'action', align: 'left' }
        ],
        loading: false,
        dataSource: [],
        page: {
            pidx: 1,
            psize: 50,
        },
        rowSelection: {
            checkStrictly: false,
            selectedRowKeys: [],
            onChange: (selectedRowKeys, selectedRows) => {
                vdatas.vtable.rowSelection.selectedRowKeys = selectedRowKeys;
            }
        },
        hide_footer: true,
    },
    draw_show: false,
})
const vfuncs = {
    loadRoles: async () => {
        let result = await api.admin.getRoles();
        if (result.flag) {
            let role_maps = {}
            result.data.forEach((v)=>{
                role_maps[v.id] = v.title;
            })
            vdatas.roles = role_maps
        }
    },
    loadData: async (pidx, psize) => {
        vdatas.vtable.loading = true;
        await vfuncs.loadRoles();
        let args = {}
        if (pidx != undefined && pidx > 0) {
            args.pidx = pidx;
        }
        if (psize != undefined && psize > 0) {
            args.psize = psize;
        }
        let params = Object.assign(vdatas.vtable.page, args);
        let values = Object.assign(vdatas.filter, params);
        let result = await api.admin.getAdmins(values);
        vdatas.vtable.loading = false;
        vdatas.vtable.rowSelection.selectedRowKeys = [];
        if (result.flag) {
            if (result.data && typeof (result.data['datas']) != 'undefined') {
                vdatas.vtable.dataSource = result.data.datas;
            }
            if (result.data && typeof (result.data['page']) != 'undefined') {
                vdatas.vtable.page = result.data.page;
            }
        }
        if (vdatas.filter.fstate < 3) {
            vdatas.vtable.hide_footer = false;
        } else {
            vdatas.vtable.hide_footer = true;
        }
    },
    search: async () => {
        return vfuncs.loadData(1);
    },
    showAddForm: async () => {
        vdatas.draw_show = true;
        vdatas.edit = {
            id: 0,
            phone: "",
            real_name: "",
            password: "",
        }
        await vfuncs.loadRoles();
        vdatas.edit_sping = false;

    },
    showEditForm: async (record) => {
        vdatas.draw_show = true;
        await vfuncs.loadRoles();
        vdatas.edit = Object.assign(vdatas.edit, record);
        vdatas.edit.role_id = "" + vdatas.edit.role_id
        vdatas.edit_sping = false;
    },
    post: async (values) => {
        vdatas.edit_sping = true;
        let params = Object.assign(vdatas.edit,values)
        params.role_id = parseInt(params.role_id);
        let result = await api.admin.postAdmins(params);
        vdatas.edit_sping = false;
        if (result.flag) {
            vdatas.draw_show = false;
            vfuncs.loadData()
        }
    },
    delete: async (ids) => {
        ids = ids.length <= 0 ? vdatas.vtable.rowSelection.selectedRowKeys : ids;
        let result = await api.admin.deleteAdmins({ act: 'delete', ids: ids })
        if (result.flag) {
            vfuncs.loadData();
        }
        util.msg.show(result);

    },
    put: async (action, ids) => {
        ids = ids.length <= 0 ? vdatas.vtable.rowSelection.selectedRowKeys : ids;
        let result = await api.admin.putAdmins({ act: action, ids: ids })
        if (result.flag) {
            vfuncs.loadData();
        }
        util.msg.show(result);
    },
}
</script>