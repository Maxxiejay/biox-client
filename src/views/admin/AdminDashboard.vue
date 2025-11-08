<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import Navbar from '@/components/Navbar.vue'
import Sidebar from '@/components/Sidebar.vue'
import StatCard from '@/components/StatCard.vue'
import { Users, Flame, Activity, Zap } from 'lucide-vue-next'
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'
import { adminService } from '@/services/admin.service'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const router = useRouter()
const sidebarOpen = ref(false)
const totalUsers = ref(0)
const activeStoves = ref(0)
const totalFuelToday = ref(0)
const totalCookingEventsToday = ref(0)
const labels = ref([])


onMounted(() => {
  try {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    if (!user || user.role !== 'admin') router.push('/login')

    fetchStats()
  } catch {
    router.push('/login')
  }
})

async function fetchStats() {
  try {
    const stats = await adminService.getStats()
    console.log('Admin stats:', stats)
    totalUsers.value = stats.totalUsers || 0
    activeStoves.value = stats.activeStoves || 0
    totalFuelToday.value = stats.totalFuelToday || 0
    totalCookingEventsToday.value = stats.totalCookingEventsToday || 0
    
    // Update both labels and data for the chart
    data.value = {
      labels: stats.dateRange,
      datasets: [{
        label: 'Fuel (kg)',
        data: stats.fuelChartData,
        backgroundColor: 'hsl(var(--primary))',
        borderRadius: 8,
      }]
    }
  } catch (error) {
    console.error('Failed to fetch admin stats:', error)
  }
}

const data = ref({
  labels: [],
  datasets: [{
    label: 'Fuel (kg)',
    data: [],
    backgroundColor: 'hsl(var(--primary))',
    borderRadius: 8,
  }],
})

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { labels: { color: 'hsl(var(--foreground))' } },
    tooltip: {
      backgroundColor: 'hsl(var(--card))',
      titleColor: 'hsl(var(--foreground))',
      bodyColor: 'hsl(var(--foreground))',
      borderColor: 'hsl(var(--border))',
      borderWidth: 1,
    },
  },
  scales: {
    x: { ticks: { color: 'hsl(var(--muted-foreground))' }, grid: { color: 'hsl(var(--border) / 0.5)' } },
    y: { ticks: { color: 'hsl(var(--muted-foreground))' }, grid: { color: 'hsl(var(--border) / 0.5)' } },
  },
}
</script>

<template>
  <div class="flex h-screen bg-background">
    <Sidebar :is-open="sidebarOpen" :is-admin="true" @close="sidebarOpen = false" />

    <div class="flex-1 flex flex-col overflow-hidden">
      <Navbar @toggle-menu="sidebarOpen = !sidebarOpen" />

      <main class="flex-1 overflow-auto">
        <div class="p-6 lg:p-8 animate-fade-in">
          <div class="mb-8">
            <h2 class="text-3xl font-bold text-foreground mb-2">Admin Dashboard</h2>
            <p class="text-muted-foreground">System-wide analytics and monitoring</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard title="Total Users" :icon="Users" :value="`${totalUsers}`" trend="+18% this month" :trendUp="true" iconBg="cool" />
            <StatCard title="Active Stoves" :icon="Flame" :value="`${activeStoves}`" trend="+23% this month" :trendUp="true" iconBg="fire" />
            <StatCard title="Total Fuel Today" :icon="Activity" :value="`${totalFuelToday} Kg`" trend="+8% vs yesterday" :trendUp="true" iconBg="cool" />
            <StatCard title="Cooking Events" :icon="Zap" :value="`${totalCookingEventsToday}`" trend="+2% improvement" :trendUp="true" iconBg="cool" />
          </div>

          <div class="border border-border rounded-xl shadow-card">
            <div class="p-6">
              <h3 class="text-lg font-semibold">Daily System Usage</h3>
              <p class="text-sm text-muted-foreground">Total fuel consumption across all users</p>
            </div>
            <div class="h-80 p-4">
              <Bar :data="data" :options="options" />
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
</style>


