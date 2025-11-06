<script setup>
import { useRouter } from 'vue-router'
import { toast } from 'vue-sonner'
import { Flame, Menu, LogOut } from 'lucide-vue-next'

const emit = defineEmits(['toggle-menu'])
const router = useRouter()

const user = (() => {
  try { return JSON.parse(localStorage.getItem('user') || '{}') } catch { return {} }
})()

function handleLogout() {
  localStorage.removeItem('user')
  localStorage.removeItem('token')
  toast.success("Logged out", { description: "You've been successfully logged out." })
  router.push('/login')
}
</script>

<template>
  <nav class="bg-card border-b border-border sticky top-0 z-50 shadow-card">
    <div class="px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <div class="flex items-center gap-4">
          <button class="lg:hidden inline-flex items-center justify-center h-10 w-10 rounded-md hover:bg-muted"
                  @click="$emit('toggle-menu')" aria-label="Toggle menu">
            <Menu class="h-5 w-5" />
          </button>
          <div class="flex items-center gap-2">
            <div class="w-10 h-10 bg-gradient-fire rounded-lg flex items-center justify-center">
              <Flame class="w-5 h-5 text-primary-foreground" />
            </div>
            <div class="hidden sm:block">
              <h1 class="text-lg font-bold text-foreground">Smart Stove Monitor</h1>
            </div>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 bg-gradient-cool rounded-full flex items-center justify-center">
              <span class="text-sm font-medium text-secondary-foreground">
                {{ (user.email?.[0] || 'U').toUpperCase() }}
              </span>
            </div>
            <span class="hidden sm:inline text-sm">{{ user.email }}</span>
          </div>
          <button class="inline-flex items-center gap-2 h-10 px-3 rounded-md hover:bg-muted"
                  @click="handleLogout">
            <LogOut class="h-4 w-4" />
            <span>Log out</span>
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

<style scoped>
</style>


