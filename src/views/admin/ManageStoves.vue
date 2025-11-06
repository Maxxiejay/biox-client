<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Navbar from '@/components/Navbar.vue'
import Sidebar from '@/components/Sidebar.vue'
import { Flame, Plus, Search } from 'lucide-vue-next'
import { toast } from 'vue-sonner'
import { adminService } from '../../services/admin.service'

const router = useRouter()
const sidebarOpen = ref(false)
const searchQuery = ref('')
const isLoading = ref(false)
const isModalOpen = ref(false)
const newStove = ref({stoveId: '', stoveModel: ''})

onMounted(() => {
  try {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    if (!user || user.role !== 'admin') router.push('/login')
  } catch {
    router.push('/login')
  }
})

const stoves = [
  { id: 'STOVE-2024-001', model: 'EcoFlame Pro', status: 'active', owner: 'john@example.com', fuelUsed: '45.2 kg' },
  { id: 'STOVE-2024-002', model: 'SmartCook X1', status: 'active', owner: 'jane@example.com', fuelUsed: '32.8 kg' },
  { id: 'STOVE-2024-003', model: 'EcoFlame Pro', status: 'inactive', owner: 'bob@example.com', fuelUsed: '18.5 kg' },
  { id: 'STOVE-2024-004', model: 'CleanBurn 500', status: 'active', owner: 'alice@example.com', fuelUsed: '52.1 kg' },
  { id: 'STOVE-2024-005', model: 'SmartCook X1', status: 'active', owner: 'charlie@example.com', fuelUsed: '28.9 kg' },
]

const filteredStoves = computed(() => stoves.filter(s =>
  s.id.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
  s.model.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
  s.owner.toLowerCase().includes(searchQuery.value.toLowerCase())
))

function handleToggleModal() {
  isModalOpen.value = !isModalOpen.value
}

function handleRegisterStove(e){
  e.preventDefault()
  isLoading.value = true
  try {
    adminService.registerStove(newStove.value)
    toast.success("Stove registered successfully")
    handleToggleModal()
  } catch (error) {
    toast.error("Stove registration failed", {description: error.message})
  }finally{
    isLoading.value = false
  }
}
</script>

<template>
  <div class="flex h-screen bg-background">
    <Sidebar :is-open="sidebarOpen" :is-admin="true" @close="sidebarOpen = false" />

    <div class="flex-1 flex flex-col overflow-hidden">
      <Navbar @toggle-menu="sidebarOpen = !sidebarOpen" />

      <main class="flex-1 overflow-auto">
        <div class="p-6 lg:p-8 animate-fade-in">
          <div class="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 class="text-3xl font-bold text-foreground mb-2">Manage Stoves</h2>
              <p class="text-muted-foreground">Register and monitor all stoves in the system</p>
            </div>
            <button @click="handleToggleModal" class="inline-flex items-center gap-2 h-10 px-4 rounded-md bg-primary text-primary-foreground hover:opacity-90">
              <Plus class="w-4 h-4" />
              Register Stove
            </button>
          </div>

          <div class="bg-card border border-border rounded-xl shadow-card">
            <div class="p-6 border-b border-border">
              <h3 class="text-lg font-semibold">All Stoves</h3>
              <p class="text-sm text-muted-foreground">View and manage registered stoves</p>
              <div class="relative mt-4">
                <Search class="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <input v-model="searchQuery" placeholder="Search by ID, model, or owner..." class="pl-10 w-full h-10 rounded-md border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring" />
              </div>
            </div>
            <div class="p-6 overflow-x-auto">
              <table class="w-full text-sm">
                <thead>
                  <tr class="text-left border-b border-border">
                    <th class="py-2 pr-4">Stove ID</th>
                    <th class="py-2 pr-4">Model</th>
                    <th class="py-2 pr-4">Status</th>
                    <th class="py-2 pr-4">Owner</th>
                    <th class="py-2 pr-4">Fuel Used</th>
                    <!-- <th class="py-2 pr-0 text-right">Actions</th> -->
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="stove in filteredStoves" :key="stove.id" class="border-b border-border/60">
                    <td class="py-3 pr-4 font-medium">{{ stove.id }}</td>
                    <td class="py-3 pr-4">{{ stove.model }}</td>
                    <td class="py-3 pr-4">
                      <span :class="['inline-flex items-center px-2 py-1 rounded-md text-xs border', stove.status === 'paired' ? 'border-transparent bg-secondary text-secondary-foreground' : 'border-border text-foreground']">
                        {{ stove.status }}
                      </span>
                    </td>
                    <td class="py-3 pr-4">{{ stove.owner }}</td>
                    <td class="py-3 pr-4">{{ stove.fuelUsed }}</td>
                    <td class="py-3 pr-0 text-right">
                      <!-- <button class="h-8 px-3 rounded-md hover:bg-muted">Details</button> -->
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
    <!-- Register stove modal -->
     <div v-if="isModalOpen" class="absolute top-0 left-0 w-full h-screen backdrop-blur-sm flex items-center justify-center">
      <div class="max-w-2xl mx-auto">
            <div class="bg-card border border-border rounded-xl shadow-elevated">
              <div class="p-6 border-b border-border flex items-center gap-2">
                <Flame class="w-5 h-5 text-primary" />
                <h3 class="text-lg font-semibold">Stove Registration</h3>
              </div>
              <div class="p-6">
                <form @submit="handleRegisterStove" class="space-y-6">
                  <div class="space-y-2">
                    <label for="stoveId" class="text-sm font-medium">Stove ID</label>
                    <input id="stoveId" v-model="newStove.stoveId" placeholder="e.g., STOVE-2024-001" required class="w-full h-10 rounded-md border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring" />
                    <p class="text-sm text-muted-foreground">Found on the device label or packaging</p>
                  </div>

                  <div class="space-y-2">
                    <label for="stoveModel" class="text-sm font-medium">Model</label>
                    <input id="stoveModel" v-model="newStove.stoveModel" placeholder="e.g., ABC-123-XYZ" required class="w-full h-10 rounded-md border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring" />
                    <!-- <p class="text-sm text-muted-foreground">6-character code provided with your stove</p> -->
                  </div>

                  <div class="flex flex-col sm:flex-row gap-3">
                    <button type="submit" :disabled="isLoading" class="flex-1 inline-flex items-center justify-center h-10 rounded-md bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-60">
                      {{ isLoading ? 'Registering...' : 'Register' }}
                    </button>
                    <button @click="handleToggleModal" type="button" class="flex-1 inline-flex items-center justify-center h-10 rounded-md border border-border bg-background hover:bg-muted">
                     Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
     </div>
  </div>
</template>

<style scoped>
</style>


