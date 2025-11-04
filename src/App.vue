<script setup>
import { Toaster } from 'vue-sonner'
</script>

<template>
  <div class="min-h-screen bg-background text-foreground">
    <RouterView />
    <Toaster richColors position="top-right" />
  </div>
  
</template>

<style scoped>
</style>
