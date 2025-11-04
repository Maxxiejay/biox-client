<script setup>
import { ref } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { Flame, Mail, Lock } from 'lucide-vue-next'
import { toast } from 'vue-sonner'

const router = useRouter()
const email = ref('')
const password = ref('')
const isLoading = ref(false)

function handleLogin(e) {
  e.preventDefault()
  isLoading.value = true
  setTimeout(() => {
    if (email.value && password.value) {
      const role = email.value.includes('admin') ? 'admin' : 'user'
      localStorage.setItem('user', JSON.stringify({ email: email.value, role }))
      toast.success('Welcome back!', { description: "You've successfully logged in." })
      router.push(role === 'admin' ? '/admin/dashboard' : '/dashboard')
    }
    isLoading.value = false
  }, 1000)
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-subtle p-4">
    <div class="w-full max-w-md animate-fade-in">
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-gradient-fire rounded-2xl shadow-fire mb-4">
          <Flame class="w-8 h-8 text-primary-foreground" />
        </div>
        <h1 class="text-3xl font-bold text-foreground mb-2">Smart Stove Monitor</h1>
        <p class="text-muted-foreground">Monitor and optimize your cooking efficiency</p>
      </div>

      <div class="bg-card border border-border rounded-xl shadow-elevated">
        <div class="p-6 border-b border-border">
          <h2 class="text-lg font-semibold">Sign In</h2>
          <p class="text-sm text-muted-foreground">Enter your credentials to access your dashboard</p>
        </div>
        <div class="p-6">
          <form @submit="handleLogin" class="space-y-4">
            <div class="space-y-2">
              <label for="email" class="text-sm font-medium">Email</label>
              <div class="relative">
                <Mail class="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <input id="email" type="email" v-model="email" placeholder="you@example.com" required class="pl-10 w-full h-10 rounded-md border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring" />
              </div>
            </div>
            <div class="space-y-2">
              <label for="password" class="text-sm font-medium">Password</label>
              <div class="relative">
                <Lock class="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <input id="password" type="password" v-model="password" placeholder="••••••••" required class="pl-10 w-full h-10 rounded-md border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring" />
              </div>
            </div>
            <button type="submit" :disabled="isLoading" class="w-full inline-flex items-center justify-center h-10 rounded-md bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-60">
              {{ isLoading ? 'Signing in...' : 'Sign In' }}
            </button>
          </form>
          <div class="mt-4 text-center text-sm">
            <span class="text-muted-foreground">Don't have an account? </span>
            <RouterLink to="/register" class="text-primary hover:underline font-medium">Sign up</RouterLink>
          </div>
          <div class="mt-6 p-4 bg-muted rounded-lg text-sm">
            <p class="font-medium mb-2">Demo Accounts:</p>
            <p class="text-muted-foreground">User: user@demo.com / password</p>
            <p class="text-muted-foreground">Admin: admin@demo.com / password</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>


