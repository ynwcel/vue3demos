import { request } from "./request";
export const api = {
    getCaptcha:()=>{
        return {flag:true,data:"/captcha.png",msg:""}
    },
    login:(values)=>{
        let actions = [
            { id: 1, pid: 0, title: '管理入口' },
            { id: 2, pid: 1, title: '管理入口', view: '/main/main.vue' },
            { id: 3, pid: 0, title: '系统管理' },
            { id: 4, pid: 3, title: '菜单列表', view: '/main/main.vue' },
            { id: 5, pid: 3, title: '角色列表', view: '/main/main.vue' },
            { id: 6, pid: 3, title: '管理员列表', view: '/main/main.vue' },
        ];
        let authtoken = "1235414";
        let data = Object.assign(values,{actions,authtoken})
        return { flag: true, data: data, msg: "" }
    }
}