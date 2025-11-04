<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Navbar from '@/components/Navbar.vue'
import Sidebar from '@/components/Sidebar.vue'
import { Search } from 'lucide-vue-next'

const router = useRouter()
const sidebarOpen = ref(false)
const searchQuery = ref('')

onMounted(() => {
  try {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    if (!user || user.role !== 'admin') router.push('/login')
  } catch {
    router.push('/login')
  }
})

const users = [
  { id: 1, name: 'John Doe', email: 'john@example.com', stoves: 2, fuelUsed: '78.5 kg', joined: '2024-01-15' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', stoves: 1, fuelUsed: '32.8 kg', joined: '2024-02-01' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', stoves: 3, fuelUsed: '125.3 kg', joined: '2024-01-20' },
  { id: 4, name: 'Alice Williams', email: 'alice@example.com', stoves: 1, fuelUsed: '52.1 kg', joined: '2024-02-10' },
  { id: 5, name: 'Charlie Brown', email: 'charlie@example.com', stoves: 2, fuelUsed: '89.7 kg', joined: '2024-01-28' },
]

const filteredUsers = computed(() => users.filter(u =>
  u.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
  u.email.toLowerCase().includes(searchQuery.value.toLowerCase())
))
</script>

<template>
  <div class="flex h-screen bg-background">
    <Sidebar :is-open="sidebarOpen" :is-admin="true" @close="sidebarOpen = false" />

    <div class="flex-1 flex flex-col overflow-hidden">
      <Navbar @toggle-menu="sidebarOpen = !sidebarOpen" />

      <main class="flex-1 overflow-auto">
        <div class="p-6 lg:p-8 animate-fade-in">
          <div class="mb-8">
            <h2 class="text-3xl font-bold text-foreground mb-2">Manage Users</h2>
            <p class="text-muted-foreground">View and manage all registered users</p>
          </div>

          <div class="bg-card border border-border rounded-xl shadow-card">
            <div class="p-6 border-b border-border">
              <h3 class="text-lg font-semibold">All Users</h3>
              <p class="text-sm text-muted-foreground">Complete list of users and their activity</p>
              <div class="relative mt-4">
                <Search class="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <input v-model="searchQuery" placeholder="Search by name or email..." class="pl-10 w-full h-10 rounded-md border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring" />
              </div>
            </div>
            <div class="p-6 overflow-x-auto">
              <table class="w-full text-sm">
                <thead>
                  <tr class="text-left border-b border-border">
                    <th class="py-2 pr-4">User</th>
                    <th class="py-2 pr-4">Email</th>
                    <th class="py-2 pr-4">Stoves</th>
                    <th class="py-2 pr-4">Total Fuel Used</th>
                    <th class="py-2 pr-4">Joined</th>
                    <th class="py-2 pr-0 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="u in filteredUsers" :key="u.id" class="border-b border-border/60">
                    <td class="py-3 pr-4 font-medium">
                      <div class="flex items-center gap-2">
                        <div class="w-8 h-8 bg-gradient-cool rounded-full flex items-center justify-center">
                          <span class="text-xs font-medium text-secondary-foreground">{{ u.name[0] }}</span>
                        </div>
                        {{ u.name }}
                      </div>
                    </td>
                    <td class="py-3 pr-4">{{ u.email }}</td>
                    <td class="py-3 pr-4">
                      <span class="inline-flex items-center px-2 py-1 rounded-md text-xs border border-border">{{ u.stoves }} stoves</span>
                    </td>
                    <td class="py-3 pr-4">{{ u.fuelUsed }}</td>
                    <td class="py-3 pr-4">{{ u.joined }}</td>
                    <td class="py-3 pr-0 text-right">
                      <button class="h-8 px-3 rounded-md hover:bg-muted">View Profile</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
</style>


