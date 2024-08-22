import { ref, computed,reactive } from 'vue'
import { defineStore } from 'pinia'
const dynamicViews = import.meta.glob('@/views/*/*.vue');

export const useAuthStore = defineStore('auth', () => {
    let data = reactive({
        userid: "",
        username: "",
        realname: "",
        authtoken: "",
        actions: [],
    })
    const apply = (values) => {
        data = Object.assign(data,values);
    }
    const quit = () => {
        data.userid = 0;
        data.username = "";
        data.realname = "";
        data.authtoken = "";
        data.actions = [];
    }

    const getRouters = ()=>{
        let routers = [];
        for (let idx in data.actions) {
            let item = data.actions[idx];
            if (item.pid > 0) {
                let item_path = `/${item.href.replace(/\.vue$/, '').replace(/^\//, '')}`;
                let item_view = `/src/views/${item.view.replace(/^\//, '').replace(/\.vue/,'')}.vue`;
                let item_route = {
                    path: item_path,
                    name: item.title,
                };
                if (typeof (dynamicViews[item_view]) != 'undefined') {
                    item_route.component = dynamicViews[item_view];
                }
                routers.push(item_route)
            }
        }
        return routers;
    }
    const buildMenus = () => {
        let menus = [];
        for (let r in data.actions) {
            let v = data.actions[r];
            if (v.pid != 0) {
                continue;
            }
            let m = {
                key: (r + 2) * 100,
                label: v.title,
                title: v.title,
                children: [],
            }
            for (let rr in data.actions) {
                let vv = data.actions[rr];
                if (vv.pid != v.id) {
                    continue;
                }
                m.children.push({
                    key: m.key + (rr + 1),
                    title: vv.title,
                    label: vv.title,
                    path: '/' + vv.href.replace(/\.vue$/, '').replace(/^\//, ''),
                })
            }
            menus.push(m);
        }
        return menus;
    }

    return { data, apply, quit, getRouters,buildMenus };
}, {
    persist: {
        storage: window.sessionStorage,
    }
})
