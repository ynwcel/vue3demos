import { request } from "@/helper";

export const admin = {
    getActions: (values) => {
        let actions = [
            { id: 1,is_show:1,pid: 0, title: '管理入口',view:"#", },
            { id: 2,is_show:1,pid: 1, title: '管理入口', view: '/main/main.vue', href: '/system/main' },
            { id: 3,is_show:1,pid: 0, title: '系统管理',view:"#"},
            { id: 4,is_show:1,pid: 3, title: '菜单列表', view: '/system/actions.vue', href: '/system/actions' },
            { id: 5,is_show:1,pid: 3, title: '角色列表', view: '/system/roles.vue', href: '/system/roles' },
            { id: 6,is_show:1,pid: 3, title: '管理员列表', view: '/system/admins.vue', href: '/system/admins' },
            { id: 11, is_show: 1, pid: 0, title: '管理入口', view: "#", },
            { id: 12, is_show: 1, pid: 11, title: '管理入口', view: '/main/main.vue', href: '/system/main' },
            { id: 13, is_show: 1, pid: 0, title: '系统管理', view: "#" },
            { id: 14, is_show: 1, pid: 13, title: '菜单列表', view: '/system/actions.vue', href: '/system/actions' },
            { id: 15, is_show: 1, pid: 13, title: '角色列表', view: '/system/roles.vue', href: '/system/roles' },
            { id: 16, is_show: 1, pid: 13, title: '管理员列表', view: '/system/admins.vue', href: '/system/admins' },
            { id: 21, is_show: 1, pid: 0, title: '管理入口', view: "#", },
            { id: 22, is_show: 1, pid: 21, title: '管理入口', view: '/main/main.vue', href: '/system/main' },
            { id: 23, is_show: 1, pid: 0, title: '系统管理', view: "#" },
            { id: 24, is_show: 1, pid: 23, title: '菜单列表', view: '/system/actions.vue', href: '/system/actions' },
            { id: 25, is_show: 1, pid: 23, title: '角色列表', view: '/system/roles.vue', href: '/system/roles' },
            { id: 26, is_show: 1, pid: 23, title: '管理员列表', view: '/system/admins.vue', href: '/system/admins' },
        ];
        return { flag: true, data: actions, msg: "" }
    }
}