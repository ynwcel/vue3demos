import { request } from "@/helper";
import static_captcha from "@/assets/captcha.jpg";

export const admin = {
    getCaptcha: (values) => {
        return {
            flag: true, data: {
                captcha_pic: static_captcha,
                captcha_id: "",
            }, msg: ""
        }
        return request.get('/captcha',values).json();
    },
    postLogin: (values) => {
        let actions = [
            { id: 1, pid: 0, title: '管理入口' },
            { id: 2, pid: 1, title: '管理入口', view: '/main/main.vue', href: '/main/main' },
            { id: 3, pid: 0, title: '系统管理' },
            { id: 4, pid: 3, title: '菜单列表', view: '/admin/actions.vue', href: '/admin/actions' },
            { id: 5, pid: 3, title: '角色列表', view: '/admin/roles.vue', href: '/admin/roles' },
            { id: 6, pid: 3, title: '管理员列表', view: '/admin/admins.vue', href: '/admin/admins' },
        ];
        let userid = 100001;
        let realname = "黑枫叶";
        let authtoken = "1235414";
        let data = Object.assign(values, { userid, actions, authtoken, realname })
        return { flag: true, data: data, msg: "" }
        return request.post('/login', values).json();
    },
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
        return request.get('/actions', values).json();
    }
}