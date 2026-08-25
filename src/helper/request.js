import NProgress from "nprogress";

let API_URL = "/api"
if (typeof (import.meta.env['VITE_API_URL']) == "string" && import.meta.env.VITE_API_URL.length > 0) {
    API_URL = import.meta.env.VITE_API_URL.replace(/\/+$/, '');
}

export const request = {
    format:(method,url,params,is_json=false,options={})=>{
        if(typeof(options)!='object'){
            options = {};
        }
        if (url.indexOf(API_URL) != 0) {
            url = API_URL + "/" + url.replace(/^\/+/, '')
        }
        let fopts = {
            'method': method,
            'headers': {
                'AuthToken': "",
            },
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
                fopts.body = is_json ? JSON.stringify(params) : params;
            }
        }

        if (is_json) {
            fopts.headers['Content-Type'] = 'application/json;charset=utf-8';
        }
        fopts = Object.assign(fopts, options);
        return [url,fopts];
    },
    send:async (method,url,params,is_json=true,options={})=>{
        NProgress.start();
        let [fmt_url,fmt_option] = request.format(method,url,params,is_json,options);
        try{
            let response = await fetch(fmt_url, fmt_option);
            return {"code":response.status,"response":response};
        }catch($err){
            return {"code":500,"response":new Response(),"err":$err};
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
    upload: async function (url,file_field,file, values={}) {
        let form = new FormData();
        form.append(file_field,file,file.name);
        if(typeof(values)=='object'){
            Object.keys(values).forEach(v=>{
                form.append(v,values[v]);
            })
        }
        let options = {
            body:form,
            'Content-Type':'multipart/form-data',
        }
        return await request.send('post',url, {},false,options);
    },
    download:async(method,url,params, is_json=true,options={},save_file="")=>{
        NProgress.start();
        let [fmt_url,fmt_option] = request.format(method,url,params,is_json,options);
        try {
            let response = await request.fetch(fmt_url,fmt_option)
            let content_dispostion_filename = "";
            if(response.headers.get('Content-Disposition')){
                const content_dispostion = response.headers.get('Content-Disposition');
                if(`${content_dispostion}`.indexOf('filename=')>0){
                    content_dispostion_filename = decodeURIComponent(`${content_dispostion}`.split('filename=')[1])
                }else if (`${content_dispostion}`.indexOf(`filename*=utf-8''`)>0){
                    content_dispostion_filename = decodeURIComponent(`${content_dispostion}`.split(`filename*=utf-8''`)[1])
                }
            }
            save_file = content_dispostion_filename ? content_dispostion_filename : save_file;
            if(!save_file){
                throw new Error('获取导出文件名出错');
            }
            let data = await response.blob();
            let blobUrl = window.URL.createObjectURL(data);
            const alink = document.createElement("a");
            alink.href = blobUrl;
            alink.download = save_file;
            alink.click();
        } catch ($err) {
            return {"code":500,"response":new Response(),"err":$err};
        }finally{
            NProgress.done();
        }
    },
}
