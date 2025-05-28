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
    send:async (method,url,params,is_json=true)=>{
        NProgress.start();
        let options = {
            "method":method,
            "AuthToken":auth.data.authtoken,
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
        try{
            let response = await fetch(request.format(url), options);
            return {"code":response.status,"response":response};
        }catch($err){
            return {"code":500,"response":new Response()};
        }finally{
            NProgress.done();
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
        return  await request.send('put', url, values, is_json);
    },
    delete: async (url, values, is_json=true) => {
        return  await request.send('delete', url, values, is_json);
    },
    upload: async function (url, datas) {
        let options = {
            body: datas,
        }
        return await request.send('post',url, {},false,options);
    },
}