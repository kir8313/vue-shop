import { createRouter, createWebHistory } from 'vue-router';
import {authFirebase} from "@/utils/firebase.config";
import {onAuthStateChanged} from "firebase/auth";

const routes = [
  {
    path: '/auth',
    component: () => import('@/views/Auth.vue'),
    meta: {
      layout: 'auth'
    }
  },
  {
    path: '/register',
    component: () => import('@/views/Register.vue'),
    meta: {
      layout: 'auth'
    }
  },
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/Shop.vue'),
    meta: {
      layout: 'main'
    }
  },
  {
    path: '/product/:id',
    component: () => import('@/views/Product.vue'),
    meta: {
      layout: 'main'
    }
  },
  {
    path: '/cart',
    component: () => import('@/views/Cart.vue'),
    meta: {
      layout: 'main'
    }
  },
  {
    path: '/admin/goods',
    component: () => import('@/views/AdminGoods.vue'),
    meta: {
      layout: 'main',
      auth: true,
    }
  },
  {
    path: '/admin/categories',
    component: () => import('@/views/AdminCategories.vue'),
    meta: {
      layout: 'main',
      auth: true,
    }
  },

  { path: "/:error(.*)*", redirect: '/' },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from) => {
  const isAuth = to.matched.some(rout => rout.meta.auth)
  onAuthStateChanged(authFirebase, (user) => {
    if (!user && isAuth && !localStorage.getItem('token')) {
      router.push('/auth')
    }
  });
  // if (to.meta.auth && )
})

export default router
