import fs from 'fs-extra'
import { bundle, okMark, failMark } from './bundle'
import { BuildOptions } from 'vite'
import { resolveConfig } from '../config'
import { renderPage } from './render'
import { OutputChunk, OutputAsset } from 'rollup'
import ora from 'ora'
import { resolvePwaPlugin } from './pwa'

export async function build(root: string, buildOptions: BuildOptions = {}) {
  const start = Date.now()

  process.env.NODE_ENV = 'production'
  const siteConfig = await resolveConfig(root)

  const pwaPlugin = await resolvePwaPlugin()
  const pwaPluginConfigured = pwaPlugin !== undefined

  try {
    siteConfig.vite = siteConfig.vite || {}
    if (pwaPluginConfigured) {
      siteConfig.vite.define = siteConfig.vite.define || {}
      // todo@userquin: check output for pwa, must be .vitepress/dist
      siteConfig.vite.define['process.env.PWA'] = 'true'
    } else {
      // if the plugin is not configured we need to exclude from rollup, since build will fail
      siteConfig.vite.build = siteConfig.vite.build || {}
      siteConfig.vite.build.rollupOptions =
        siteConfig.vite.build.rollupOptions || {}
      // if external is configured, the user should fix it
      if (!siteConfig.vite.build.rollupOptions.external)
        siteConfig.vite.build.rollupOptions.external = [
          'virtual:pwa-register/vue'
        ]
    }

    const [clientResult, , pageToHashMap] = await bundle(
      siteConfig,
      buildOptions
    )

    const spinner = ora()
    spinner.start('rendering pages...')

    try {
      const appChunk = clientResult.output.find(
        (chunk) => chunk.type === 'chunk' && chunk.isEntry
      ) as OutputChunk

      const cssChunk = clientResult.output.find(
        (chunk) => chunk.type === 'asset' && chunk.fileName.endsWith('.css')
      ) as OutputAsset

      // We embed the hash map string into each page directly so that it doesn't
      // alter the main chunk's hash on every build. It's also embedded as a
      // string and JSON.parsed from the client because it's faster than embedding
      // as JS object literal.
      const hashMapString = JSON.stringify(JSON.stringify(pageToHashMap))

      for (const page of siteConfig.pages) {
        await renderPage(
          siteConfig,
          page,
          clientResult,
          appChunk,
          cssChunk,
          pageToHashMap,
          hashMapString,
          pwaPlugin !== undefined
        )
      }
    } catch (e) {
      spinner.stopAndPersist({
        symbol: failMark
      })
      throw e
    }
    spinner.stopAndPersist({
      symbol: okMark
    })
    if (pwaPlugin) {
      spinner.start('generating PWA...')
      try {
        await pwaPlugin.generateSW()
      } catch (e) {
        spinner.stopAndPersist({
          symbol: failMark
        })
        throw e
      }
      spinner.stopAndPersist({
        symbol: okMark
      })
    }
  } finally {
    await fs.remove(siteConfig.tempDir)
  }

  console.log(`build complete in ${((Date.now() - start) / 1000).toFixed(2)}s.`)
}
