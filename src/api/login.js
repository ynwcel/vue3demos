import { request } from "@/helper";
import static_captcha from '@/assets/captcha.jpg'
export const login = {
    getCaptcha: (old_captcha_id) => {
        return { flag: true, data: {
            captcha_pic: static_captcha,
            captcha_id : "",
        }, msg: "" }
    },
    post: (values) => {
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
    }
}