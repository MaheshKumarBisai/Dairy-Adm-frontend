import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const adminBackendUrl = env.VITE_ADMIN_BACKEND_URL || 'http://localhost:4001';

  return {
    plugins: [react()],
    server: {
      port: 3001,
      proxy: {
        '/api': {
          target: adminBackendUrl,
          changeOrigin: true,
        },
        '/uploads': {
          target: adminBackendUrl,
          changeOrigin: true,
        },
      },
    },
  };
});

