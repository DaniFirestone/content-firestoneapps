import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

// Firebase App Hosting provides FIREBASE_WEBAPP_CONFIG at build time.
// Parse it and map to the VITE_FIREBASE_* env vars that firebase.ts expects.
const fbConfig = process.env.FIREBASE_WEBAPP_CONFIG;
if (fbConfig) {
  try {
    const c = JSON.parse(fbConfig);
    const map: Record<string, string> = {
      VITE_FIREBASE_API_KEY: c.apiKey,
      VITE_FIREBASE_AUTH_DOMAIN: c.authDomain,
      VITE_FIREBASE_PROJECT_ID: c.projectId,
      VITE_FIREBASE_STORAGE_BUCKET: c.storageBucket,
      VITE_FIREBASE_MESSAGING_SENDER_ID: c.messagingSenderId,
      VITE_FIREBASE_APP_ID: c.appId,
    };
    for (const [key, val] of Object.entries(map)) {
      if (val && !process.env[key]) process.env[key] = val;
    }
  } catch { /* local dev uses .env file instead */ }
}

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  assetsInclude: ['**/*.svg', '**/*.csv'],
})
