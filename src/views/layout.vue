<template>
<a-layout class="layout-wrap">
    <a-layout-header class="layout-header">
        <a-flex justify="space-between">
            <a-flex justify="flex-start" align="center">
                <a-button type="text" v-show="!vdatas.desktopIsPc" @click="vdatas.siderCollsped=!vdatas.siderCollsped" >
                    <Icon icon="carbon:menu" />
                </a-button>
                <div class="layout-header-logo">
                    <img src="/logo.png" height="60px"/>
                </div>
            </a-flex>
            <div class="layout-header-actions">
                <a-button @click="vfuncs.logout" type="text">退出</a-button>
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
            <c-scrollbar height="100%">
                <a-menu mode="inline" @select="vfuncs.siderMemuChange" v-model:selectedKeys="vdatas.menuInitSelected" v-model:openKeys="vdatas.menuInitOpened">
                    <div v-for="(menu,idx) of vdatas.menus" :key="menu.key">
                        <a-sub-menu v-bind:key="menu.key" :title="menu.title">
                            <template #icon><Icon icon="ion:list" /></template>
                            <div v-for="(submenu,subidx) of menu.children" :key="submenu.key">
                                <a-menu-item v-bind:key="submenu.key" :title="submenu.title">{{submenu.title}}</a-menu-item>
                            </div>
                        </a-sub-menu>
                    </div>
                </a-menu>
            </c-scrollbar>
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
</template>


<script setup>
import{useAuthStore} from '@/stores'
onMounted(()=>{
    vfuncs.changeContentHeaderTitle()
})
const auth = useAuthStore();
const router = useRouter();

const vdatas = reactive({
    desktopIsPc:true,
    siderCollsped:false,
    siderCollapseWidth:48,
    menus:auth.buildMenus(),
    menuInitSelected:[],
    menuInitOpened:[],
    breadcrumbs:[],
})
const vfuncs = {
    siderBreakpoint: (isXl)=>{
        console.log('isXl',isXl)
        if(isXl){
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
    siderMemuChange: (menu)=>{
        if(!vdatas.desktopIsPc){
            vdatas.siderCollsped=true;
        }
        if(typeof(menu.item.path)!='undefined' && menu.item.path){
            router.push(menu.item.path);
            vfuncs.changeContentHeaderTitle(menu.item.path);
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
    logout:()=>{
        auth.quit();
        router.replace('/login');
    }
}
</script>