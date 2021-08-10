/**
 * @type {import('vitepress').UserConfig}
 */
const config = {
  title: 'Vitepress minimal',
  description: 'Vitepress minimal',
  lang: 'en-US',
  head: [
    ['meta', { name: 'theme-color', content: '#ffffff' }],
    ['link', { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' }],
    [
      'link',
      {
        rel: 'alternate icon',
        href: '/favicon.ico',
        type: 'image/png',
        sizes: '16x16'
      }
    ],
    ['link', { rel: 'mask-icon', href: '/favicon.svg', color: '#ffffff' }],
    ['meta', { property: 'og:title', content: 'Vitepress minimal' }],
    ['meta', { property: 'og:description', content: 'Vitepress minimal' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    [
      'link',
      {
        rel: 'apple-touch-icon',
        href: '/apple-touch-icon.png',
        sizes: '180x180'
      }
    ]
  ],
  themeConfig: {
    logo: '/favicon.svg',
    repo: 'vuejs/vitepress',
    docsDir: 'docs',
    editLinks: true,
    editLinkText: 'Edit this page',
    lastUpdated: 'Last Updated'
    /*
      algolia: {
        apiKey: 'todo@antfu: replace this',
        indexName: 'vite-plugin-pwa',
        searchParameters: {
          // for translations maintainers: change the filter to your locale code (subdomain name)
          facetFilters: ['language:en']
        }
      },
    */
  }
}

module.exports = config
