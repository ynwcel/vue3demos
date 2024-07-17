<template>
<a-layout class="layout-wrap">
    <a-layout-header class="layout-header">
        <a-flex justify="space-between" align="center">
            <a-button type="text"  v-show="!vdatas.desktopIsPc" @click="vdatas.siderCollsped=!vdatas.siderCollsped" >
                <Icon icon="carbon:menu" class="icon-14" />
            </a-button>
            <div class="layout-header-logo">
                <img src="@/assets/logo.png" height="48px"/>
            </div>
            <div class="layout-header-actions">
                <template v-if="vdatas.desktopIsPc">
                    <a-space>
                        <a-dropdown arrow>
                            <a href="javascript:;">
                                <a-space>
                                        <a-avatar :size="24">
                                            <template #icon>
                                                <img src="@/assets/avatar2.png" />
                                            </template>
                                        </a-avatar>
                                        <span>
                                            {{vdatas.realname}}
                                            <Icon icon="mingcute:down-fill" />
                                        </span>
                                </a-space>
                            </a>
                            <template #overlay>
                                <a-menu>
                                    <a-menu-item key="1" @click="vdatas.drawer_show=true;">
                                        <a-space>
                                            <Icon icon="uil:setting" />
                                            修改密码
                                        </a-space>
                                    </a-menu-item>
                                    <a-menu-item key="2" @click="vfuncs.logout">
                                        <a-space>
                                            <Icon icon="ci:exit" />
                                            退出登录
                                        </a-space>
                                    </a-menu-item>
                                </a-menu>
                            </template>
                        </a-dropdown>
                    </a-space>
                </template>
                <template v-else>
                    <a-dropdown arrow>
                        <a-button type="text">
                            <Icon icon="ri:more-fill"/>
                        </a-button>
                        <template #overlay>
                            <a-menu>
                                <a-sub-menu :title="vdatas.realname" :key="10001">
                                    <template #icon>
                                        <a-avatar :size="24">
                                            <template #icon>
                                                <img src="@/assets/avatar2.png" />
                                            </template>
                                        </a-avatar>
                                    </template>
                                    <a-menu-item key="1" @click="vdatas.drawer_show=true;">
                                        <a-space>
                                            <Icon icon="uil:setting" />
                                            修改密码
                                        </a-space>
                                    </a-menu-item>
                                    <a-menu-item key="2" @click="vfuncs.logout">
                                        <a-space>
                                            <Icon icon="ci:exit" />
                                            退出登录
                                        </a-space>
                                    </a-menu-item>
                                </a-sub-menu>
                            </a-menu>
                        </template>
                    </a-dropdown>
                </template>
            </div>
        </a-flex>
    </a-layout-header>
    <a-layout class="layout-body">
        <a-layout-sider width="240" class="layout-body-sider" 
            :collapsedWidth="vdatas.siderCollapseWidth" 
            :collapsed="vdatas.siderCollsped"  
            :collapsible="vdatas.desktopIsPc" 
            @collapse="vfuncs.siderTrigger"
            breakpoint="xl" 
            @breakpoint="vfuncs.siderBreakpoint"
        >
        <a-flex vertical>
            <div class="layout-body-sider-search">
                <a-form layout="inline">
                    <a-form-item @click="vfuncs.siderSearchFocus()">
                        <a-auto-complete  :style="{width: vdatas.siderCollsped ? '34px':'200px'}"  :options="vdatas.menuSearchOptions" v-model:value="vdatas.menuSearchSelect" @search="vfuncs.searchMenu" @select="vfuncs.selectSearchMenu">
                            <template #default>
                                <a-input ref="sider_search_menu_input" placeholder="菜单过滤" :style="{'padding-left': '0.5rem' }">
                                    <template #prefix>
                                        <Icon icon="ant-design:search-outlined"/>
                                    </template>
                                </a-input>
                            </template>
                        </a-auto-complete>
                    </a-form-item>
                </a-form>

            </div>
            <div style="height: calc( 100% - 50px);">
                <c-scrollbar height="100%">
                    <a-menu mode="inline"  v-model:selectedKeys="vdatas.menuInitSelected" v-model:openKeys="vdatas.menuInitOpened">
                        <a-sub-menu v-for="(menu,idx) of vdatas.menus" v-bind:key="menu.key" :title="menu.title">
                            <template #icon>
                                <Icon icon="ion:list" class="icon-15" />
                            </template>
                            <a-menu-item v-for="(submenu,subidx) of menu.children" v-bind:key="submenu.key" :title="submenu.title" @click="vfuncs.siderMemuChange(submenu)">
                                {{submenu.title}}
                            </a-menu-item>
                        </a-sub-menu>
                    </a-menu>
                </c-scrollbar>
            </div>
        </a-flex>
        </a-layout-sider>
        <a-layout class="layout-body-main">
            <div class="layout-body-main-cover" @click="vdatas.siderCollsped=!vdatas.siderCollsped"  v-show="!vdatas.desktopIsPc && !vdatas.siderCollsped"></div>
            <a-card  class="layout-body-main-header">
                <a-breadcrumb>
                    <a-breadcrumb-item>
                        <Icon icon="gis:position" />
                        {{vdatas.breadcrumbs[0]}}
                    </a-breadcrumb-item>
                    <a-breadcrumb-item><b>{{vdatas.breadcrumbs[1]}}</b></a-breadcrumb-item>
                </a-breadcrumb>
            </a-card>
            <c-scrollbar height="100%">
                <a-layout-content>
                    <RouterView />
                </a-layout-content>
            </c-scrollbar>
        </a-layout>
    </a-layout>
</a-layout>

<a-drawer v-model:open="vdatas.drawer_show" title="修改密码" placement="right" :maskClosable="false" :width="vdatas.draw_width">
    <a-form :model="vdatas.change_pwd" autocomplete="off" @finish="vfuncs.post_change_pwd" hideRequiredMark :label-col="{span:5}">
        <a-form-item label="用户名">
            {{auth.data.username}}
        </a-form-item>
        <a-form-item label="真实姓名">
            {{auth.data.realname}}
        </a-form-item>
        
        <a-form-item label="重置新密码" name="password" :rules="[{required:true,message:''}]">
            <a-input-password v-model:value="vdatas.change_pwd.password"></a-input-password>
        </a-form-item>

        <a-form-item label="确认新密码" name="repassword" :rules="[{required:true,message:''}]">
            <a-input-password v-model:value="vdatas.change_pwd.repassword"></a-input-password>
        </a-form-item>

        <a-form-item name="userid" :wrapper-col="{offset:5 }">
            <a-input v-model:value="vdatas.change_pwd.userid" type="hidden"></a-input>
            <a-space>
                <a-button type="primary" html-type="submit">确定</a-button>
                <a-button html-type="button" @click="vdatas.drawer_show=false">取消</a-button>
            </a-space>
        </a-form-item>
    </a-form>
</a-drawer>

</template>


<script setup>
import {util} from '@/helper';
import{useAuthStore} from '@/stores'
import { ref } from 'vue';

onMounted(()=>{
    vfuncs.changeContentHeaderTitle()
})
const auth = useAuthStore();
const router = useRouter();
const sider_search_menu_input = ref();

const vdatas = reactive({
    realname:auth.data.realname,
    desktopIsPc:true,
    siderCollsped:false,
    siderCollapseWidth:48,
    menus:auth.buildMenus(),
    menuInitSelected:[],
    menuInitOpened:[],
    menuSearchOptions:[],
    menuSearchSelect:"",
    breadcrumbs:[],
    drawer_show:false,
    draw_width:util.fwidth(580),
    change_pwd:{
        userid:auth.data.userid,
    },
})
const vfuncs = {
    siderBreakpoint: (lessXl)=>{
        if(lessXl){
            vdatas.desktopIsPc = false
            vdatas.siderCollapseWidth = 0;
            vdatas.siderCollsped=true;
        }else{
            vdatas.desktopIsPc = true
            vdatas.siderCollapseWidth = 48;
            vdatas.siderCollsped=false;
        }
    },
    siderTrigger:(collapsed,type)=>{
        if(vdatas.desktopIsPc && type == 'clickTrigger'){
            vdatas.siderCollsped=!vdatas.siderCollsped;
        }
    },
    siderSearchFocus:(event)=>{
        vdatas.siderCollsped=false;
        sider_search_menu_input.value.focus();
    },
    searchMenu:(val)=>{
        let options = [];
        for(let parent of vdatas.menus){
            for(let submenu of parent.children){
                if(submenu.title.indexOf(val)>=0){
                    options.push({
                        value:submenu.key,
                        label:submenu.title,
                    })
                }
            }
        }
        vdatas.menuSearchOptions = options;
    },
    selectSearchMenu:(select_key)=>{
        let find_menu = null;
        for (let parent of vdatas.menus) {
            let find = false;
            for (let submenu of parent.children) {
                if(submenu.key == select_key){
                    find_menu = submenu;
                    find = true;
                    break;
                }
            }
            if(find){
                break;
            }
        }
        vdatas.menuSearchSelect = find_menu.title;
        vfuncs.siderMemuChange(find_menu);
    },
    siderMemuChange: (menu)=>{
        if(!vdatas.desktopIsPc){
            vdatas.siderCollsped=true;
        }
        if(typeof(menu.path)!='undefined' && menu.path){
            router.push(menu.path);
            vfuncs.changeContentHeaderTitle(menu.path);
        }
    },
    changeContentHeaderTitle:(path)=>{
        if(!path){
            path = window.location.href;
        }
        for(let v of vdatas.menus){
            let find = false;
            for(let subv of v.children){
                if(path.indexOf(subv.path)>=0){
                    vdatas.breadcrumbs=reactive([v.title,subv.title]);
                    vdatas.menuInitOpened = [v.key]
                    vdatas.menuInitSelected = [subv.key];
                    find = true;
                    break;
                }
            }
            if(find){
                break;
            }
        }
    },
    post_change_pwd:(values)=>{
        console.log(values);
    },
    logout:()=>{
        auth.quit();
        router.replace('/login');
    }
}
</script>