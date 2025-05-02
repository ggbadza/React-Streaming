import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Video.js 플러그인 최적화 설정 추가
  optimizeDeps: {
    include: ['videojs-contrib-quality-levels', 'videojs-hls-quality-selector']
  },
  build: {
    commonjsOptions: {
      include: [/node_modules/]
    }
  }
})
