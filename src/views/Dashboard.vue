<script setup>
import { onMounted, ref } from 'vue'
import Navbar from '@/components/Navbar.vue'
import Sidebar from '@/components/Sidebar.vue'
import StatCard from '@/components/StatCard.vue'
import { Flame, Clock, Calendar, Activity, Zap, Droplet } from 'lucide-vue-next'
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'
import { userService } from '../services/user.service'

const totalStoves = ref(0)
const avgCookingTime = ref(0)
const totalFuelToday = ref(0)
const totalCookingEventsToday = ref(0)
const labels = ref([])

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const sidebarOpen = ref(false)

async function fetchStats() {
  try {
    const stats = await userService.getStats()
    console.log('User stats:', stats)
    totalStoves.value = stats.totalStoves || 0
    avgCookingTime.value = stats.avgCookingTime || 0
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

onMounted(() => {
  try {
    fetchStats()
  } catch {
    router.push('/login')
  }
})

</script>

<template>
  <div class="flex h-screen bg-background">
    <Sidebar :is-open="sidebarOpen" @close="sidebarOpen = false" />

    <div class="flex-1 flex flex-col overflow-hidden">
      <Navbar @toggle-menu="sidebarOpen = !sidebarOpen" />

      <main class="flex-1 overflow-auto">
        <div class="p-6 lg:p-8 animate-fade-in">
          <div class="mb-8">
            <h2 class="text-3xl font-bold text-foreground mb-2">Dashboard</h2>
            <p class="text-muted-foreground">Monitor your stove usage and cooking analytics</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard :icon="Droplet" title="Total Fuel Used" :value="`${totalFuelToday}`" trend="+12% from last week" :trendUp="true" iconBg="cool" />
            <StatCard :icon="Clock" title="Avg Time (mins)" :value="`${avgCookingTime}`" trend="-5% from last week" :trendUp="false" iconBg="cool" />
            <StatCard :icon="Zap" title="Cooking events" :value="`${totalCookingEventsToday}`" iconBg="muted" />
            <StatCard :icon="Flame" title="Total Stoves" :value="`${totalStoves}`" trend="+3% improvement" :trendUp="true" iconBg="fire" />
          </div>

          <div class="border border-border rounded-xl shadow-card">
            <div class="p-6">
              <h3 class="text-lg font-semibold">Weekly Fuel Usage</h3>
              <p class="text-sm text-muted-foreground">Your fuel consumption over the past 7 days</p>
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


