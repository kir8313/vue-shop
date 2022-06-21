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
    component: () => import('@/views/admin/Admin.vue'),
    name: "Admin",
    redirect: {name: 'AdminProducts'},
    meta: {
      layout: 'admin',
      admin: true,
    },
    children: [
      {
        path: 'goods',
        name: 'AdminProducts',
        component: () => import('@/views/admin/AdminGoods.vue'),
      },
      {
        path: 'categories',
        component: () => import('@/views/admin/AdminCategories.vue'),
      },
    ]
  },
  {path: "/:error(.*)*", redirect: '/'},
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  const isRequireAuth = to.meta.auth;
  const isRequireAdmin = to.meta.admin;

  if (isRequireAdmin) {
    if (!store.getters['auth/isAdmin']) {
      return next('/auth?message=admin');
    } else {
      return next();
    }
  }

  if (isRequireAuth) {
    if (!store.getters['auth/isAuthenticated']) {
      return router.push('/auth?message=auth');
    } else {
      return next();
    }
  }
  next();
})

export default router
