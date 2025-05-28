import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite';
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        AutoImport({   // 注册并使用配置项
            imports: [
                'vue',
                'vue-router',
            ],
            vueTemplate: true,
        }),
        Components({
            dirs: ['src/vcpns'],
            resolvers: [
                (Component) => {
                    if (Component == "Iconify") {
                        return { importName: Component.substring(0, 4), path: '@iconify/vue' }
                    }
                }
            ],
        }),
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    }
})
