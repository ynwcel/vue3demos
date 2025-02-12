import { util } from './util';
import { useAuthStore } from '@/stores';
import { router } from '@/router';
import NProgress from "nprogress";
import { useFetch } from '@vueuse/core';

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
    fetch:async(url,options={})=>{
        NProgress.start();
        if (typeof (options) != 'object') {
            options = {}
        }
        options.headers['Auth-Token'] = auth.data.authtoken;
        let result = await useFetch(request.format(url), options);
        NProgress.done();
        return result;
    },
    send:async (method,url,params,is_json=true)=>{
        let options = {
            "method":method,
        }
        if (typeof (params) != 'undefined' && params){
            if(`${method}`.toLowerCase() == 'get'){
                let query = new URLSearchParams(params).toString();
                if(url.indexOf('?')<0){
                    url = url+"?"+query
                }else{
                    url = url+"&"+query;
                }
            }else{
                options.body = is_json ? JSON.stringify(params) : params;
            }
        }
    },
    get: async (url, values, is_json=true) => {
        let params = new URLSearchParams(values).toString();
        return await request.send('get', `${url}?${params}`, null, is_json);
    },
    post: async (url, values, is_json=true) => {
        return await request.send('post', url, values, is_json);
    },
    put: async (url, values, is_json=true) => {
        let result = await request.send('put', url, values, is_json);
        if (result.flag) {
            util.msg.ok('操作成功');
        }
        return result;
    },
    delete: async (url, values, is_json=true) => {
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