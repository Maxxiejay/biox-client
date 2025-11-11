<script setup>
import { Flame, LayoutDashboard, Users, Settings, X, Menu } from 'lucide-vue-next'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const props = defineProps({
  isOpen: { type: Boolean, default: false },
  isAdmin: { type: Boolean, default: false },
})
const emit = defineEmits(['close'])

const route = useRoute()

const userLinks = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/stoves/pair', icon: Flame, label: 'Pair Stove' },
  // { to: '/settings', icon: Settings, label: 'Settings' },
]

const adminLinks = [
  { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/stoves', icon: Flame, label: 'Manage Stoves' },
  { to: '/admin/users', icon: Users, label: 'Manage Users' },
]

const links = computed(() => (props.isAdmin ? adminLinks : userLinks))
</script>

<template>

    <div v-if="isOpen" class="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden" @click="$emit('close')" />

    <aside
      :class="[
        'fixed top-0 left-0 h-full w-64 bg-card border-r border-border z-50 transform transition-transform duration-300 ease-in-out',
        isOpen ? 'translate-x-0' : '-translate-x-full',
        'lg:translate-x-0 lg:static'
      ]"
    >
      <div class="flex flex-col h-full">
        <div class="flex items-center justify-between p-4 border-b border-border">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8  rounded-lg flex items-center justify-center">
              <Menu class="w-4 h-4 text-primary" />
            </div>
            <span class="font-semibold text-foreground">Menu</span>
          </div>
          <button class="lg:hidden inline-flex items-center justify-center h-10 w-10 rounded-md hover:bg-muted" @click="$emit('close')">
            <X class="h-5 w-5" />
          </button>
        </div>

        <nav class="flex-1 p-4 space-y-2 flex flex-col gap-3">
          <RouterLink v-for="link in links" :key="link.to" :to="link.to" @click="$emit('close')">
            <div
              :class="[
                'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                route.path === link.to ? 'bg-primary text-primary-foreground' : 'hover:bg-muted text-foreground'
              ]"
            >
              <component :is="link.icon" class="w-5 h-5" />
              <span class="font-medium">{{ link.label }}</span>
            </div>
          </RouterLink>
        </nav>
      </div>
    </aside>
  
</template>

<style scoped>
</style>


