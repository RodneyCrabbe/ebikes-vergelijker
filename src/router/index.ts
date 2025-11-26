import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/HomePage.vue'),
  },
  {
    path: '/vergelijk',
    name: 'Compare',
    component: () => import('../views/ComparePage.vue'),
  },
  {
    path: '/e-bikes',
    name: 'EBikeList',
    component: () => import('../views/EBikeListPage.vue'),
  },
  {
    path: '/e-bikes/:id',
    name: 'EBikeDetail',
    component: () => import('../views/EBikeDetailPage.vue'),
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/LoginPage.vue'),
  },
  {
    path: '/registreer',
    name: 'Register',
    component: () => import('../views/RegisterPage.vue'),
  },
  {
    path: '/afspraak',
    name: 'Appointments',
    component: () => import('../views/AppointmentsPage.vue'),
  },
  {
    path: '/reviews',
    name: 'Reviews',
    component: () => import('../views/ReviewsPage.vue'),
  },
  {
    path: '/over-ons',
    name: 'About',
    component: () => import('../views/AboutPage.vue'),
  },
  {
    path: '/contact',
    name: 'Contact',
    component: () => import('../views/ContactPage.vue'),
  },
  {
    path: '/profiel',
    name: 'Profile',
    component: () => import('../views/SimpleProfilePage.vue'),
  },
  {
    path: '/dealer',
    name: 'DealerPortal',
    component: () => import('../views/SimpleDealerPortal.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // Always scroll to top when navigating to a new page
    if (savedPosition) {
      // If there's a saved position (e.g., from browser back/forward), use it
      return savedPosition
    } else {
      // Otherwise, scroll to top
      return { top: 0, behavior: 'smooth' }
    }
  },
})

// Navigation guard removed - no authentication required for local data

export default router