<script setup>
const props = defineProps({
  title: { type: String, required: true },
  value: { type: String, required: true },
  trend: { type: String, default: '' },
  trendUp: { type: Boolean, default: undefined },
  icon: { type: Function, default: null },
  iconBg: { type: String, default: '' },
})
</script>

<template>
  <div class="bg-card border border-border rounded-xl p-4 shadow-card">
    <div class="flex items-center justify-between">
      <div>
        <p class="text-sm text-muted-foreground">{{ title }}</p>
        <p class="text-2xl font-bold mt-1">{{ value }}</p>
      </div>
      <div :class="['w-10 h-10 rounded-lg flex items-center justify-center', iconBg === 'fire' ? 'shadow-fire bg-gradient-fire' : iconBg === 'cool' ? 'bg-gradient-cool' : 'bg-muted']">
        <component v-if="icon" :is="icon" class="w-5 h-5 text-primary-foreground" />
      </div>
    </div>
    <!-- <p v-if="trend" class="mt-2 text-xs" :class="trendUp === true ? 'text-emerald-600' : trendUp === false ? 'text-rose-600' : 'text-muted-foreground'">
      {{ trend }}
    </p> -->
  </div>
</template>

<style scoped>
</style>


