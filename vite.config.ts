import { fileURLToPath, URL } from 'node:url'
import { defineConfig, type UserConfig, type PluginOption } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import pkg from './package.json'

export default defineConfig(({ mode }): UserConfig => {
    const isProduction = mode === 'production'

    return {
        base: '/god-note/',
        plugins: [
            vue(),
            // 只有在非生產模式下才加入 DevTools
            !isProduction && (vueDevTools() as any),
        ].filter(Boolean) as PluginOption[],
        resolve: {
            alias: {
                '@': fileURLToPath(new URL('./src', import.meta.url))
            },
        },
        // Vite 7 移除 Console 的標準寫法
        esbuild: {
            drop: isProduction ? ['console', 'debugger'] : [],
        },
        build: {
            // 生產環境開啟壓縮，測試環境更精準
            minify: 'esbuild',
            sourcemap: !isProduction, // 生產模式關閉 sourcemap 以保護原始碼
        },
        define: {
            // 定義全域變數 __APP_VERSION__
            __APP_VERSION__: JSON.stringify(pkg.version),
        }
    }
})