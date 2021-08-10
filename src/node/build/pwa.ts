import { resolveConfig } from 'vite'

export async function resolvePwaPlugin() {
  const config = await resolveConfig({}, 'build', 'production')
  return config.plugins.find((i) => i.name === 'vite-plugin-pwa')?.api
}
