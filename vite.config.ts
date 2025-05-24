import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// 配置组件自动注册的插件
import Components from 'unplugin-vue-components/vite'
// 配置 vant UI 组件库的解析器
import { VantResolver } from 'unplugin-vue-components/resolvers'
// 配置 svg 图标的插件
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import path from 'node:path'

// https://vite.dev/config/
export default defineConfig({
  server: {
    port: 80,
    host: true,
    allowedHosts: ['consult-patients.itheima.net']
  },
  plugins: [
    vue(),
    vueDevTools(),
    // 小问题：在自动引入组件时也会自动引入样式
    // 导致：样式重复引入，类型声明文件重复
    Components({
      dts: false,
      resolvers: [VantResolver({ importStyle: false })]
    }),
    createSvgIconsPlugin({
      iconDirs: [path.resolve(process.cwd(), 'src/icons')]
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
