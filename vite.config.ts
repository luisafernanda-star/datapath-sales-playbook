import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const appVersion = process.env.VERCEL_GIT_COMMIT_SHA || process.env.COMMIT_REF || process.env.GITHUB_SHA || `${Date.now()}`

// https://vite.dev/config/
export default defineConfig({
  define: { __APP_VERSION__: JSON.stringify(appVersion) },
  plugins: [
    react(),
    {
      name: 'datapath-version-file',
      configureServer(server) {
        server.middlewares.use('/version.json', (_request, response) => {
          response.setHeader('Content-Type', 'application/json')
          response.end(JSON.stringify({ version: appVersion }))
        })
      },
      generateBundle() {
        this.emitFile({ type: 'asset', fileName: 'version.json', source: JSON.stringify({ version: appVersion }) })
      }
    }
  ],
})
