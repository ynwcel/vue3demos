import { createRouter, createWebHistory } from 'vue-router'
import NProgress from "nprogress";

export const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        { path: "", redirect: "/index" },
        { path: "/index.html", redirect: "/index" },
        { path: "/index", name: "index", component: () => import('@/views/Index.vue') },
    ]
})

router.beforeEach((to, from) => {
    NProgress.start();
})
router.afterEach((to, from) => {
    NProgress.done();
})