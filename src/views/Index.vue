<template>
    <div style="padding:1rem;margin:1rem">
        <h1>Hello World</h1>
        <hr />
        <p>font-size:1.4rem</p>
        <p class="f16rem">font-size:1.6rem</p>
        <p class="f18rem">font-size:1.8rem</p>
        <p class="f20rem">font-size:2.0rem</p>
        <p>util.ffixwidth() = {{ util.ffixwidth() }}</p>
        <hr />
        <button @click="sendMsg" style="padding:.6rem">use-eventbus-send-msg</button>
        <hr />
        <button class="btn" @click="send_api('get',$event)">get-api</button>
        <button class="btn" @click="send_api('post',$event)">post-api</button>
        <button class="btn" @click="send_api('put',$event)">put-api</button>
        <button class="btn" @click="send_api('delete',$event)">delete-api</button>
    </div>
</template>

<script setup>
import { useAppBaseEventBus } from '@/helper';
import { util,request } from '@/helper';

console.log(util);
const sendMsg = (e)=>{
    useAppBaseEventBus().emit({
        event:e,
        data:{
            a:1,
            b:2,
            t:(new Date()).getTime(),
        }
    })
}
const send_api = async (method,event)=>{
    let result = null;
    let url = `/${method}/api`
    if(method == 'get'){
        result = await request.get(url,{})
    }else if(method == 'post'){
        result = await request.post(url,{})
    }else if(method == 'put'){
        result = await request.put(url,{})
    }else if(method == 'delete'){
        result = await request.delete(url,{})
    }
    console.log(method,result,event);
}

</script>
<style scope>
.btn{
    padding:1rem 1.8rem;
    border-radius:0.5rem;
    margin-right:1rem;
}
</style>