<script setup>
import { ref } from 'vue'
import Navbar from '@/components/Navbar.vue'
import Sidebar from '@/components/Sidebar.vue'
import StatCard from '@/components/StatCard.vue'
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

const sidebarOpen = ref(false)

const labels = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']
const data = {
  labels,
  datasets: [
    {
      label: 'Fuel (kg)',
      data: [2.4, 3.1, 2.8, 3.5, 2.2, 4.1, 3.8],
      borderColor: 'hsl(var(--primary))',
      backgroundColor: 'hsl(var(--primary))',
      tension: 0.4,
      pointRadius: 4,
      pointHoverRadius: 6,
    },
  ],
}

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { labels: { color: getComputedStyle(document.documentElement).getPropertyValue('--foreground') } },
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
            <StatCard title="Total Fuel Used" value="21.9 kg" trend="+12% from last week" :trendUp="true" iconBg="fire" />
            <StatCard title="Avg Cooking Time" value="45 min" trend="-5% from last week" :trendUp="false" iconBg="cool" />
            <StatCard title="Active Days" value="7 days" iconBg="muted" />
            <StatCard title="Efficiency Score" value="87%" trend="+3% improvement" :trendUp="true" iconBg="cool" />
          </div>

          <div class="border border-border rounded-xl shadow-card">
            <div class="p-6">
              <h3 class="text-lg font-semibold">Weekly Fuel Usage</h3>
              <p class="text-sm text-muted-foreground">Your fuel consumption over the past 7 days</p>
            </div>
            <div class="h-80 p-4">
              <Line :data="data" :options="options" />
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
</style>


