import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores'
import NProgress from "nprogress";

export const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        { path: "", redirect: "/login" },
        { path: "/login", name: "login", component: () => import('@/views/login.vue') },
        { path: "/", name: "layout", component: () => import('@/views/layout.vue') },
        { path: "/:match(.*?)", name: "err404", component: () => import('@/views/err404.vue') }
    ]
})

router.beforeEach((to, from) => {
    NProgress.start();
    const auth = useAuthStore();
    if (to.path.toLowerCase() != "/login") {
        if (!auth.data.authtoken) {
            return '/login';
        }
    }
    if (to.name.toLowerCase() == 'err404') {
        const dynamicRoutes = auth.getRouters();
        let find = false;
        for (let i in dynamicRoutes) {
            router.addRoute('layout', dynamicRoutes[i]);
            if (to.path.toLowerCase() == dynamicRoutes[i].path) {
                find = true;
            }
        }
        if (find) {
            return to.fullPath;
        }
    }
})
router.afterEach((to, from) => {
    NProgress.done();
})