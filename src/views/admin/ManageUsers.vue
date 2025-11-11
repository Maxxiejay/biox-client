<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Navbar from '@/components/Navbar.vue'
import Sidebar from '@/components/Sidebar.vue'
import { Search, User, Calendar, Box, Flame, Clock } from 'lucide-vue-next'
import { adminService } from '../../services/admin.service'
import UserProfileModal from '@/components/UserProfileModal.vue'

const router = useRouter()
const sidebarOpen = ref(false)
const searchQuery = ref('')
const users = ref([])
const isLoading = ref(false)
const isModalOpen = ref(false)
const fetchError = ref(null)
const currentUser = ref(null)

onMounted(() => {
  try {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    if (!user || user.role !== 'admin') router.push('/login')

    fetchUsers()
  } catch {
    router.push('/login')
  }
})

async function fetchUsers() {
  isLoading.value = true
  fetchError.value = null
  try {
    const data = await adminService.getAllUsers()
    // API may return { users: [...] } or directly an array. Handle both.
    if (Array.isArray(data)) {
      users.value = data
    } else if (Array.isArray(data?.users)) {
      users.value = data.users
    } else {
      // fallback: try to coerce into array
      users.value = data ? [data] : []
    }
    console.log('Fetched users:', users.value)
  } catch (error) {
    fetchError.value = error
    console.error('Failed to fetch users:', error)
  } finally {
    isLoading.value = false
  }
}

const filteredUsers = computed(() => {
  const q = (searchQuery.value || '').trim().toLowerCase()
  const list = Array.isArray(users.value) ? users.value : []
  if (!q) return list
  return list.filter(u => {
    const name = (u?.name || '').toLowerCase()
    const email = (u?.email || '').toLowerCase()
    return name.includes(q) || email.includes(q)
  })
})

function formatDate(dateStr) {
  const date = new Date(dateStr)
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
}



function formatDuration(minutes) {
  if (minutes == null) return '—'
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return h > 0 ? `${h}h ${m}m` : `${m}m`
}

function handleViewUser(userId) {
  currentUser.value = users.value.find(u => u.id === userId) || null
  isModalOpen.value = true
  console.log('View user with ID:', userId, currentUser.value)
}
</script>

<template>
  <div class="flex h-screen bg-background">
    <Sidebar :is-open="sidebarOpen" :is-admin="true" @close="sidebarOpen = false" />

    <div class="flex-1 flex flex-col overflow-hidden">
      <Navbar @toggle-menu="sidebarOpen = !sidebarOpen" />

      <main class="flex-1 overflow-auto relative">
        <div class="p-6 lg:p-8 animate-fade-in">
          <div class="mb-8">
            <h2 class="text-3xl font-bold text-foreground mb-2">Manage Users</h2>
            <p class="text-muted-foreground">View and manage all registered users</p>
          </div>

          <div class="bg-card border border-border rounded-xl shadow-card">
            <div class="p-6 border-b border-border">
                <div class="flex items-start justify-between gap-4">
                  <div>
                    <h3 class="text-lg font-semibold">All Users</h3>
                    <p class="text-sm text-muted-foreground">Complete list of users and their activity</p>
                    <p v-if="fetchError" class="text-xs text-destructive mt-2">Failed to load users — see console for details.</p>
                  </div>
                  <div class="flex items-center gap-2">
                    <button @click="fetchUsers" class="h-8 px-3 rounded-md border border-border bg-background text-sm">Refresh</button>
                    <div v-if="isLoading" class="text-sm text-muted-foreground">Loading...</div>
                  </div>
                </div>
              <div class="relative mt-4">
                <Search class="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <input v-model="searchQuery" placeholder="Search by name or email..." class="pl-10 w-full h-10 rounded-md border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring" />
              </div>
            </div>
            <div class="p-6 overflow-x-auto">
              <table class="w-full text-sm">
                <thead>
                  <tr class="text-center border-b border-border">
                    <th class="py-2 px-4">User</th>
                    <th class="py-2 px-4">Email</th>
                    <th class="py-2 px-4">Stoves</th>
                    <th class="py-2 px-4">Total Fuel Used</th>
                    <th class="py-2 px-4">Joined</th>
                    <th class="py-2 pr-0 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="u in filteredUsers" :key="u.id" class="border-b border-border/60 text-center">
                    <td class="py-3 px-4 font-medium">
                      <div class="flex items-center gap-2">
                        <div class="w-8 h-8 bg-gradient-cool rounded-full flex items-center justify-center">
                          <span class="text-xs font-medium text-secondary-foreground">{{ u.name[0] }}</span>
                        </div>
                        {{ u.name }}
                      </div>
                    </td>
                    <td class="py-3 px-4">{{ u.email }}</td>
                    <td class="py-3 px-4">
                      <span class="inline-flex items-center px-2 py-1 rounded-md text-xs border border-border">{{ u.stoves.length }} stoves</span>
                    </td>
                    <td class="py-3 px-4 text-center">{{ u.usageSummary.totalFuelUsed }}</td>
                    <td class="py-3 px-4">{{ formatDate(u.createdAt) }}</td>
                    <td class="py-3 pr-0 text-right">
                      <button @click="handleViewUser(u.id)" class="h-8 px-3 rounded-md bg-primary hover:scale-105">View</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div v-if="isModalOpen" @click.self="isModalOpen = false"
         class="absolute top-0 left-0 w-full h-screen backdrop-blur-sm flex items-center justify-center overflow-y-auto">
         <div class="max-w-2xl mx-auto">
           <div class="bg-card border border-border rounded-xl shadow-elevated ">
             <div class="p-6 border-b border-border flex items-center gap-2">
               <User class="w-5 h-5 text-primary" />
               <h3 class="text-lg font-semibold">User Details</h3>
             </div>
             <div class="p-6">
              <!-- User's details -->
               <UserProfileModal v-if="currentUser" :currentUser="currentUser" />
               <div v-else>
                 <p class="text-muted-foreground">No user selected.</p>
             </div>
           </div>
           </div>
         </div>
       </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
</style>


