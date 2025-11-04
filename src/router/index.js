import { createRouter, createWebHistory } from 'vue-router'

// Lazy-loaded views (to be implemented during port)
const Login = () => import('../views/Login.vue')
const Register = () => import('../views/Register.vue')
const Dashboard = () => import('../views/Dashboard.vue')
const PairStove = () => import('../views/PairStove.vue')
const AdminDashboard = () => import('../views/admin/AdminDashboard.vue')
const ManageStoves = () => import('../views/admin/ManageStoves.vue')
const ManageUsers = () => import('../views/admin/ManageUsers.vue')
const NotFound = () => import('../views/NotFound.vue')

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    { path: '/register', component: Register },
    { path: '/dashboard', component: Dashboard },
    { path: '/stoves/pair', component: PairStove },
    { path: '/admin/dashboard', component: AdminDashboard },
    { path: '/admin/stoves', component: ManageStoves },
    { path: '/admin/users', component: ManageUsers },
    { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound },
  ],
})

// Basic auth-like guard mirroring React redirect behavior
router.beforeEach((to, from, next) => {
  const publicPages = ['/login', '/register']
  const authRequired = !publicPages.includes(to.path)
  const user = typeof window !== 'undefined' ? localStorage.getItem('user') : null

  if (authRequired && !user) {
    return next('/login')
  }
  return next()
})

export default router


