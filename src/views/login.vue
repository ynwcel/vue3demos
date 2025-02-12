<template>
<div class="login-wrap">
    <div class="login">
        <div class="login-header">
            <h2><img src="@/assets/logo.png" /></h2>
            <h4>vue3eadmin</h4>
        </div>
        <div class="login-form">
            <a-spin :spinning="vdatas.spinning">
                <a-form :model="vdatas.login" name="basic" @finish="vfuncs.loginSubmit">
                    <a-form-item name="username"  :rules="[{ required: true,message:''}]">
                        <a-input v-model:value="vdatas.login.username" placeholder="用户名" size="large">
                            <template #prefix><Iconify icon="fa-solid:user" /></template>
                        </a-input>
                    </a-form-item>

                    <a-form-item name="password" :rules="[{ required: true,message:''}]">
                        <a-input-password v-model:value="vdatas.login.password" placeholder="密码" size="large">
                            <template #prefix><Iconify icon="teenyicons:password-solid" /></template>
                        </a-input-password>
                    </a-form-item>

                    
                    <a-form-item name="captcha_val" :rules="[{ required: true,message:''}]" class="login-form-captcha">
                        <a-input v-model:value="vdatas.login.captcha_val" placeholder="验证码" size="large">
                            <template #prefix><Iconify icon="icon-park-solid:check-one" /></template>
                            <template #addonAfter>
                                <img :src="vdatas.captcha_pic" style="height:35px" @click="vfuncs.refresh" />
                            </template>
                        </a-input>
                    </a-form-item>
                    
                    <a-form-item name="remember">
                        <a-checkbox v-model:checked="vdatas.login.remember">记住账号</a-checkbox>
                    </a-form-item>

                    <a-form-item>
                        <a-button type="primary" html-type="submit" block  size="large">登录</a-button>
                    </a-form-item>
                </a-form>
            </a-spin>
        </div>
    </div>
</div>
</template>

<script setup>
import * as api from '@/api';
import {useAuthStore} from '@/stores'
import {useRouter} from 'vue-router';

let auth = useAuthStore();
let router = useRouter();

let vdatas = reactive({
    login:{
        captcha_id: '',
    },
    captcha_pic:'#',
    spinning:false,
})
let vfuncs = {
    loginSubmit:async(values) => {
        vdatas.spinning = true;
        let params = Object.assign(vdatas.login,values);
        let result = await api.admin.postLogin(params);
        if(result.flag){
            auth.apply(result.data);
            let routers = auth.getRouters();
            for(let r in routers){
                router.addRoute('layout',routers[r]);
            }
            let next = routers[0];
            router.push(next.path);
        }
        vfuncs.refresh();
        vdatas.spinning = false;
    },
    refresh:async()=>{
        let result = await api.admin.getCaptcha(vdatas.login.captcha_id);
        if(result.data){
            vdatas.captcha_pic = result.data.captcha_pic
            vdatas.login.captcha_id = result.data.captcha_id
        }
    }
}

onMounted(()=>{
    vfuncs.refresh();
})

</script>