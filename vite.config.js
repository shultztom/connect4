import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vuetify from 'vite-plugin-vuetify'

export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/connect4/' : '/',
  plugins: [vue(), vuetify({ autoImport: true })],
}))
