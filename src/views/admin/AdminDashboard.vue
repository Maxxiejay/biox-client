<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Navbar from '@/components/Navbar.vue'
import Sidebar from '@/components/Sidebar.vue'
import StatCard from '@/components/StatCard.vue'
import { Users, Flame, Activity, TrendingUp } from 'lucide-vue-next'
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const router = useRouter()
const sidebarOpen = ref(false)

onMounted(() => {
  try {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    if (!user || user.role !== 'admin') router.push('/login')
  } catch {
    router.push('/login')
  }
})

const labels = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']
const data = {
  labels,
  datasets: [{
    label: 'Fuel (kg)',
    data: [45,52,48,61,39,68,55],
    backgroundColor: 'hsl(var(--secondary))',
    borderRadius: 8,
  }],
}
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
            <StatCard title="Total Users" :icon="Users" value="1,284" trend="+18% this month" :trendUp="true" iconBg="cool" />
            <StatCard title="Active Stoves" :icon="Flame" value="2,847" trend="+23% this month" :trendUp="true" iconBg="fire" />
            <StatCard title="Total Fuel Today" :icon="Activity" value="342 kg" trend="+8% vs yesterday" :trendUp="true" iconBg="cool" />
            <StatCard title="Avg Efficiency" value="82%" :icon="TrendingUp" trend="+2% improvement" :trendUp="true" iconBg="cool" />
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


