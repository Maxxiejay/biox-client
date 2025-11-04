<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Navbar from '@/components/Navbar.vue'
import Sidebar from '@/components/Sidebar.vue'
import { Flame, QrCode } from 'lucide-vue-next'
import { toast } from 'vue-sonner'

const router = useRouter()
const sidebarOpen = ref(false)
const stoveId = ref('')
const pairingCode = ref('')
const isLoading = ref(false)

onMounted(() => {
  const user = localStorage.getItem('user')
  if (!user) router.push('/login')
})

function handlePair(e) {
  e.preventDefault()
  isLoading.value = true
  setTimeout(() => {
    if (stoveId.value && pairingCode.value) {
      toast.success('Stove paired successfully!', { description: `Stove ${stoveId.value} has been added to your account.` })
      stoveId.value = ''
      pairingCode.value = ''
      router.push('/dashboard')
    }
    isLoading.value = false
  }, 1000)
}
</script>

<template>
  <div class="flex h-screen bg-background">
    <Sidebar :is-open="sidebarOpen" @close="sidebarOpen = false" />

    <div class="flex-1 flex flex-col overflow-hidden">
      <Navbar @toggle-menu="sidebarOpen = !sidebarOpen" />

      <main class="flex-1 overflow-auto">
        <div class="p-6 lg:p-8 animate-fade-in">
          <div class="mb-8">
            <h2 class="text-3xl font-bold text-foreground mb-2">Pair New Stove</h2>
            <p class="text-muted-foreground">Connect a new stove to your account</p>
          </div>

          <div class="max-w-2xl mx-auto">
            <div class="bg-card border border-border rounded-xl shadow-elevated">
              <div class="p-6 border-b border-border flex items-center gap-2">
                <Flame class="w-5 h-5 text-primary" />
                <h3 class="text-lg font-semibold">Stove Pairing</h3>
              </div>
              <div class="p-6">
                <form @submit="handlePair" class="space-y-6">
                  <div class="space-y-2">
                    <label for="stoveId" class="text-sm font-medium">Stove ID</label>
                    <input id="stoveId" v-model="stoveId" placeholder="e.g., STOVE-2024-001" required class="w-full h-10 rounded-md border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring" />
                    <p class="text-sm text-muted-foreground">Found on the device label or packaging</p>
                  </div>

                  <div class="space-y-2">
                    <label for="pairingCode" class="text-sm font-medium">Pairing Code</label>
                    <input id="pairingCode" v-model="pairingCode" placeholder="e.g., ABC-123-XYZ" required class="w-full h-10 rounded-md border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring" />
                    <p class="text-sm text-muted-foreground">6-character code provided with your stove</p>
                  </div>

                  <div class="flex flex-col sm:flex-row gap-3">
                    <button type="submit" :disabled="isLoading" class="flex-1 inline-flex items-center justify-center h-10 rounded-md bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-60">
                      {{ isLoading ? 'Pairing...' : 'Pair Stove' }}
                    </button>
                    <button type="button" class="flex-1 inline-flex items-center justify-center h-10 rounded-md border border-border bg-background hover:bg-muted">
                      <QrCode class="mr-2 h-4 w-4" />
                      Scan QR Code
                    </button>
                  </div>
                </form>

                <div class="mt-8 p-4 bg-muted rounded-lg">
                  <h4 class="font-semibold mb-2 flex items-center gap-2">
                    <Flame class="w-4 h-4 text-primary" />
                    Pairing Instructions
                  </h4>
                  <ol class="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
                    <li>Locate the stove ID on your device label</li>
                    <li>Find the pairing code in the device manual or packaging</li>
                    <li>Enter both codes in the form above</li>
                    <li>Click "Pair Stove" to complete the setup</li>
                  </ol>
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


