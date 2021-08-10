<script setup lang="ts">
import { ref } from 'vue'

const needRefresh = ref(false)
</script>

<template>
  <div v-if="needRefresh" class="pwa-toast"></div>
</template>
