<script setup lang="ts">
import { usePwa } from '/@theme/composables/pwa'

const {
  uiData,
  needRefresh,
  close,
  updateServiceWorker,
} = usePwa()
</script>

<template>
  <div
    v-if="needRefresh"
    class="pwa-toast"
    role="alert"
    aria-labelledby='pwa-new-content'
  >
    <div id='pwa-new-content' class="new-content">{{ uiData.newContentText }}</div>
    <button type="button" @click="updateServiceWorker()">{{ uiData.reloadButton }}</button>
    <button type="button" @click="close">{{ uiData.closeButton }}</button>
  </div>
</template>
