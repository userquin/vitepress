import { computed } from 'vue'
import { DefaultTheme } from '/@theme/config'
import { inBrowser, useData, useRoute } from 'vitepress'
import { RegisterSWOptions, useRegisterSW } from 'virtual:pwa-register/vue'

export function usePwa(options?: RegisterSWOptions) {
  const route = useRoute()
  const { site } = useData()

  const { needRefresh, offlineReady, updateServiceWorker } =
    useRegisterSW(options)

  const uiData = computed(() => {
    const theme = site.value.themeConfig as DefaultTheme.Config
    const locales = theme.locales

    const data = {
      newContentText:
        'New content available, click the reload button to update.',
      reloadButton: 'Reload',
      closeButton: 'Close'
    }

    if (!locales) {
      return data
    }
    const localeKeys = Object.keys(locales)

    if (localeKeys.length <= 1) {
      return data
    }

    // handle site base
    const siteBase = inBrowser ? site.value.base : '/'

    const siteBaseWithoutSuffix = siteBase.endsWith('/')
      ? siteBase.slice(0, -1)
      : siteBase

    // remove site base in browser env
    const routerPath = route.path.slice(siteBaseWithoutSuffix.length)

    const currentLangBase = localeKeys.find((key) => {
      return key === '/' ? false : routerPath.startsWith(key)
    })

    const currentLangKey = currentLangBase ? currentLangBase : '/'

    const newContentText = locales[currentLangKey].pwaNewContentText
      ? locales[currentLangKey].pwaNewContentText
      : undefined

    newContentText && (data.newContentText = newContentText)

    const reloadButton = locales[currentLangKey].pwaReloadButton
      ? locales[currentLangKey].pwaReloadButton
      : undefined

    reloadButton && (data.reloadButton = reloadButton)

    const closeButton = locales[currentLangKey].pwaCloseButton
      ? locales[currentLangKey].pwaCloseButton
      : undefined

    closeButton && (data.closeButton = closeButton)

    return data
  })

  const close = async () => {
    offlineReady.value = false
    needRefresh.value = false
  }

  return {
    uiData,
    offlineReady,
    needRefresh,
    close,
    updateServiceWorker
  }
}
