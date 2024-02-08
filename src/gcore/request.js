import { util } from './util';
import { useAuthStore } from '@/stores';
import NProgress from "nprogress";

let auth = useAuthStore();

export const request = {
    format: (url) => {
        return 'http://127.0.0.1:8000/api/' + url.replace(/^\//, '')
    },
    send: async (method, url, values, is_json = true) => {
        NProgress.start();
        let furl = request.core.format(url);
        let options = {
            'method': method,
            'headers': {
                'Auth-Token': auth.data.auth_token,
            },
        }
        if (is_json) {
            options.headers['Content-Type'] = 'application/json;charset=utf-8';
        }
        if (typeof (values) != 'undefined' && values) {
            options.body = is_json ? JSON.stringify(values) : values;
        }
        try {
            let response = await fetch(furl, options)
            let json = await response.json();
            if (!json.flag) {
                util.msg.fail(json.msg)
            }
            return json;
        } catch (err) {
            let fail_msg = typeof (err.msg) != 'undefined' ? err.msg : "网络请求出错";
            util.msg.fail(fail_msg);
            return { flag: false, data: [], msg: fail_msg };
        }finally{
            NProgress.done();
        }
    },
    get: async (url, values, is_json = true) => {
        let params = new URLSearchParams(values).toString();
        return await request.core.send('get', `${url}?${params}`, null, is_json);
    },
    post: async (url, values, is_json = true) => {
        return await request.core.send('post', url, values, is_json);
    },
    put: async (url, values, is_json = true) => {
        let result = await request.core.send('put', url, values, is_json);
        if (result.flag) {
            util.msg.ok('操作成功');
        }
        return result;
    },
    delete: async (url, values, is_json = true) => {
        let result = await request.core.send('delete', url, values, is_json);
        if (result.flag) {
            util.msg.ok('操作成功');
        }
        return result;
    },
}