import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // If deploying to username.github.io (user/org site) -> keep base as '/'
  // If deploying to username.github.io/repo-name (project site) -> set base to '/repo-name/'
  base: '/',
})
