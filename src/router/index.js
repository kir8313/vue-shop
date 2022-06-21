import {createRouter, createWebHistory} from 'vue-router';
import store from "../store";

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
    path: '/admin',
    component: () => import('@/views/Admin.vue'),
    name: "Admin",
    redirect: {name: 'AdminProducts'},
    meta: {
      layout: 'main',
      admin: true,
    },
    children: [
      {
        path: 'goods',
        name: 'AdminProducts',
        component: () => import('@/views/AdminGoods.vue'),
      },
      {
        path: 'categories',
        component: () => import('@/views/AdminCategories.vue'),
      },
    ]
  },
  {path: "/:error(.*)*", redirect: '/'},
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from,) => {
  const isAuth = to.meta.auth;
  const isAdmin = to.meta.admin;

  if (isAdmin) {
    setTimeout(() => {
      if (!store.getters['auth/isAdmin']) {
        return router.push('/auth?message=admin');
      }
    }, 500)
  }
})

export default router
