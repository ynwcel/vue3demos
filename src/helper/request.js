import { util } from './util';
import { useAuthStore } from '@/stores';
import { router } from '@/router';
import NProgress from "nprogress";

let auth = useAuthStore();
let API_URL = "/api"
if (typeof (import.meta.env['VITE_API_URL']) == "string" && import.meta.env.VITE_API_URL.length > 0) {
    API_URL = import.meta.env.VITE_API_URL.replace(/\/+$/, '');
}


export const request = {
    format: (url) => {
        if (url.indexOf(API_URL) != 0) {
            url = API_URL + "/" + url.replace(/^\/+/, '')
        }
        return url;
    },
    fetch: async (url, options = {}) => {
        NProgress.start();
        let furl = request.format(url);
        let result = await fetch(furl, options)
        NProgress.done();
        return result;
    },
    send: async (method, url, values, is_json = true, options = {}) => {
        let fopts = {
            'method': method,
            'headers': {
                'Auth-Token': auth.data.authtoken,
            },
        }
        if (is_json) {
            fopts.headers['Content-Type'] = 'application/json;charset=utf-8';
        }
        if (typeof (values) != 'undefined' && values) {
            fopts.body = is_json ? JSON.stringify(values) : values;
        }
        fopts = Object.assign(fopts, options);
        try {
            let response = await request.fetch(url, fopts)
            let json = await response.json();
            if (json.code) {
                util.msg.fail(json.message)
                if (json.code == 403) {
                    auth.quit();
                    router.replace("/");
                }
            }
            return json;
        } catch (err) {
            let fail_msg = typeof (err.message) != 'undefined' ? err.message : "网络请求出错";
            util.msg.fail(fail_msg);
            return { code: 500, data: [], message: fail_msg };
        }
    },
    download: async (method, url, values, options = {}) => {
        let params = new URLSearchParams(values).toString();
        let url1 = `${url}?${params}`
        console.log(url1);
        let fopts = {
            'method': method,
            'headers': {
                'Auth-Token': auth.data.authtoken,
            },
        }
        fopts = Object.assign(fopts, options);
        try {
            let response = await request.fetch(url1, fopts)
            let data = await response.blob();
            let blobUrl = window.URL.createObjectURL(data);
            window.open(blobUrl, '_blank');
        } catch (err) {
            let fail_msg = typeof (err.message) != 'undefined' ? err.message : "网络请求出错";
            util.msg.fail(fail_msg);
        }
    },
    get: async (url, values, is_json = true) => {
        let params = new URLSearchParams(values).toString();
        return await request.send('get', `${url}?${params}`, null, is_json);
    },
    post: async (url, values, is_json = true) => {
        return await request.send('post', url, values, is_json);
    },
    put: async (url, values, is_json = true) => {
        let result = await request.send('put', url, values, is_json);
        if (result.flag) {
            util.msg.ok('操作成功');
        }
        return result;
    },
    delete: async (url, values, is_json = true) => {
        let result = await request.send('delete', url, values, is_json);
        if (result.flag) {
            util.msg.ok('操作成功');
        }
        return result;
    },
    upload: async function (url, datas) {
        let options = {
            body: datas,
        }
        return await request.send('post',url, {},false,options);
    },
}