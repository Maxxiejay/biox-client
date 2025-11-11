<template>
  <div v-if="currentUser" class="space-y-4">
    <!-- Profile Card -->
    <div class="p-6 bg-background border border-border rounded-lg">
      <div class="flex items-center gap-4">
        <div class="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0">
          <User class="w-8 h-8 text-white" />
        </div>
        <div class="flex-1">
          <h2 class="text-2xl font-bold text-foreground">{{ currentUser.name }}</h2>
          <p class="text-sm text-muted-foreground">{{ currentUser.email }}</p>
          <div class="mt-3 flex items-center gap-4 flex-wrap">
            <div class="flex items-center gap-2 text-xs text-muted-foreground">
              <Calendar class="w-4 h-4" />
              Joined {{ formatDate(currentUser.createdAt) }}
            </div>
            <select v-model="role" @input="changeRole(currentUser.id, role)" id="">
                <option value="admin">Admin</option>
                <option value="user">User</option>
            </select>
            <!-- <span class="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
              {{ currentUser.role }}
            </span> -->
          </div>
        </div>
      </div>
    </div>

    <!-- Main Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <!-- Paired Stoves -->
      <div class="p-6 bg-background border border-border rounded-lg">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-foreground">Paired Stoves</h3>
          <span class="px-2.5 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground">
            {{ stoveCount }}
          </span>
        </div>
        
        <div v-if="currentUser.stoves?.length" class="space-y-2">
          <div v-for="stove in currentUser.stoves" :key="stove.stove_id" 
               class="flex items-center gap-3 p-3 border border-border rounded-lg hover:bg-muted/50 transition">
            <Box class="w-5 h-5 text-blue-600 flex-shrink-0" />
            <div class="flex-1 min-w-0">
              <p class="font-medium text-sm text-foreground truncate">{{ stove.model || stove.stove_id }}</p>
              <p class="text-xs text-muted-foreground">{{ stove.stove_id }}</p>
            </div>
            <span :class="['px-2.5 py-1 rounded text-xs font-medium whitespace-nowrap', 
              stove.status === 'paired' 
                ? 'bg-green-100 text-green-700' 
                : 'bg-muted text-muted-foreground']">
              {{ stove.status }}
            </span>
          </div>
        </div>
        <div v-else class="text-sm text-muted-foreground text-center py-8">
          No stoves paired yet
        </div>
      </div>

      <!-- Usage Summary -->
      <div class="p-6 bg-background border border-border rounded-lg">
        <h3 class="text-lg font-semibold text-foreground mb-4">Usage Summary</h3>
        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-1 p-3 bg-muted/30 rounded-lg">
            <div class="flex items-center gap-2 mb-2">
              <Flame class="w-5 h-5 text-orange-600" />
              <span class="text-xs font-medium text-muted-foreground">Fuel Used</span>
            </div>
            <p class="text-xl font-bold text-foreground">{{ fuelUsed }} <span class="text-sm font-normal">Kg</span></p>
          </div>

          <div class="space-y-1 p-3 bg-muted/30 rounded-lg">
            <div class="flex items-center gap-2 mb-2">
              <Box class="w-5 h-5 text-blue-600" />
              <span class="text-xs font-medium text-muted-foreground">Active Stoves</span>
            </div>
            <p class="text-xl font-bold text-foreground">{{ activeStoves }}</p>
          </div>

          <div class="space-y-1 p-3 bg-muted/30 rounded-lg">
            <div class="flex items-center gap-2 mb-2">
              <Clock class="w-5 h-5 text-purple-600" />
              <span class="text-xs font-medium text-muted-foreground">Minutes Used</span>
            </div>
            <p class="text-xl font-bold text-foreground">{{ formatDuration(totalMinutes) }}</p>
          </div>

          <div class="space-y-1 p-3 bg-muted/30 rounded-lg">
            <div class="flex items-center gap-2 mb-2">
              <BarChart3 class="w-5 h-5 text-emerald-600" />
              <span class="text-xs font-medium text-muted-foreground">Cooking Events</span>
            </div>
            <p class="text-xl font-bold text-foreground">{{ cookingEvents }}</p>
          </div>
        </div>
        <div class="mt-4 pt-4 border-t border-border text-xs text-muted-foreground">
          Total logs: <span class="font-semibold text-foreground">{{ totalLogs }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { User, Calendar, Box, Flame, Clock, BarChart3 } from 'lucide-vue-next'
import { adminService } from '@/services/admin.service'
import { toast } from 'vue-sonner'

const props = defineProps({
  currentUser: {
    type: Object,
    default: null
  }
})

const role = ref(props.currentUser?.role || 'user')

// Computed properties for usage summary
const stoveCount = computed(() => props.currentUser?.stoves?.length || 0)
const fuelUsed = computed(() => props.currentUser?.usageSummary?.totalFuelUsed ?? '—')
const activeStoves = computed(() => props.currentUser?.usageSummary?.activeStoves ?? 0)
const totalMinutes = computed(() => props.currentUser?.usageSummary?.totalMinutesUsed ?? 0)
const cookingEvents = computed(() => props.currentUser?.usageSummary?.totalCookingEvents ?? 0)
const totalLogs = computed(() => props.currentUser?.usageSummary?.totalLogs ?? 0)

// Methods for formatting
const formatDate = (date) => {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  })
}

const formatDuration = (minutes) => {
  if (!minutes) return '0 min'
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  if (hours === 0) return `${mins}m`
  if (mins === 0) return `${hours}h`
  return `${hours}h ${mins}m`
}

async function changeRole(userId, role){
  try {
    await adminService.changeRole(userId, role)
    toast.success("User role successfully changed")
  } catch (error) {
    toast.error("Error changing role")
    console.error("Error changing role:", error)
  }
}
</script>

<style scoped>
/* Component-specific styles */
</style>