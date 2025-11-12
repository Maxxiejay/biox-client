<script setup>
import { ref } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { Flame, Mail, Lock, User } from 'lucide-vue-next'
import { toast } from 'vue-sonner'
import { authService } from '@/services/auth.service'

const router = useRouter()
const name = ref('')
const email = ref('')
const password = ref('')
const isLoading = ref(false)

const logo = new URL('@/assets/BIOX-flame.jpg', import.meta.url).href

async function handleRegister(e) {
  e.preventDefault()
  isLoading.value = true

  if (email.value && password.value) {
    try {
      await authService.signup({ email: email.value, password: password.value, name: name.value })
      toast.success('Welcome!', { description: "You've successfully signed up." })
      router.push('/dashboard')
    } catch (error) {
      toast.error('Registration failed', { description: error.message })
      // console.log(error);
      
      isLoading.value = false
    }

  }
  isLoading.value = false
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-subtle p-4">
    <div class="w-full max-w-md animate-fade-in">
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-gradient-fire rounded-2xl shadow-fire mb-4">
          <img :src="logo" alt="" class="rounded-md">
        </div>
        <h1 class="text-3xl font-bold text-foreground mb-2">BIOX Energy Solutions</h1>
        <p class="text-muted-foreground">Create your account to get started</p>
      </div>

      <div class="bg-card border border-border rounded-xl shadow-elevated">
        <div class="p-6 border-b border-border">
          <h2 class="text-lg font-semibold">Create Account</h2>
          <p class="text-sm text-muted-foreground">Sign up to start monitoring your stoves</p>
        </div>
        <div class="p-6">
          <form @submit="handleRegister" class="space-y-4">
            <div class="space-y-2">
              <label for="name" class="text-sm font-medium">Full Name</label>
              <div class="relative">
                <User class="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <input id="name" type="text" v-model="name" placeholder="John Doe" required class="pl-10 w-full h-10 rounded-md border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring" />
              </div>
            </div>
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
                <input id="password" type="password" v-model="password" placeholder="••••••••" minlength="6" required class="pl-10 w-full h-10 rounded-md border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring" />
              </div>
            </div>
            <button type="submit" :disabled="isLoading" class="w-full inline-flex items-center justify-center h-10 rounded-md bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-60">
              {{ isLoading ? 'Creating account...' : 'Create Account' }}
            </button>
          </form>
          <div class="mt-4 text-center text-sm">
            <span class="text-muted-foreground">Already have an account? </span>
            <RouterLink to="/login" class="text-primary hover:underline font-medium">Sign in</RouterLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>


