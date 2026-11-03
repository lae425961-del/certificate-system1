import { defineConfig } from 'vite'; import react from '@vitejs/plugin-react';
export default defineConfig({
  plugins: [react()],
  server: { allowedHosts: ['fix-workspace-preview-error-5173.v0.build'] },
});
