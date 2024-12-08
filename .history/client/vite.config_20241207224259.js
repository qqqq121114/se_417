import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    watch: {
      usePolling: true,    // 使用轮询方式监听文件变化
      interval: 100        // 轮询间隔
    },
    host: '0.0.0.0',      // 允许外部访问
    port: 5173,           // 指定端口
    strictPort: true,     // 端口被占用时不自动尝试下一个端口
    hmr: {
      overlay: true       // 显示热重载错误
    }
  }
})
