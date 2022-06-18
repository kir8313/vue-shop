<template>
  <header class="navbar">
    <div class="container">
      <span class="navbar__logo">{{ isAdmin ? 'Админка' : 'ShopArz' }}</span>
      <ul v-if="isAdmin" class="nav">
        <li class="nav-item">
          <router-link to="/admin/goods" class="nav-link">Продукты</router-link>
        </li>
        <li class="nav-item">
          <router-link to="/admin/categories" class="nav-link">Категории</router-link>
        </li>
        <li class="nav-item">
          <a href="/auth" class="nav-link" @click.prevent="logout">Выйти</a>
        </li>
      </ul>
      <ul v-else class="nav">
        <li class="nav-item">
          <router-link to="/" class="nav-link">Магазин</router-link>
        </li>
        <li class="nav-item">
          <router-link to="/cart" class="nav-link nav-link_basket">
            Корзина
            <span v-if="basketCount">{{ basketCount }}</span>
          </router-link>
        </li>
      </ul>
    </div>
  </header>
</template>

<script setup>
import {computed} from "vue";
import {useStore} from 'vuex'
import {useRouter} from "vue-router";

const store = useStore();
const router = useRouter();

const basketCount = computed(() => {
  if (store.getters['cart/cart']) {
    return Object.keys(store.getters['cart/cart']).length;
  }
  return null
})

const logout = () => {
  store.dispatch('auth/logout');
  router.push('/');
}

const isAdmin = computed(() => {
  return store.getters['auth/user'] && store.getters['auth/user'].role === 'admin';
})

</script>

<style scoped lang="scss">
.navbar {
  margin-bottom: 2rem;
}

.navbar__logo {
  font-size: 34px;
}

.nav-item:not(:last-child) {
  margin-right: 1.5rem;
}

.nav-link,
.nav-link:focus{
  color: var(--white);
  padding: 0;
}

.nav-link:hover {
  color: #919191;
}

.router-link-active {
  border-bottom: 1px solid var(--white);
  pointer-events: none;
}

.nav-link.router-link-active:focus-visible {
  border-color: #5b5b5b;
  color: #5b5b5b;
}

.nav-link_basket {
  position: relative;

  span {
    position: absolute;
    top: -15px;
    right: -15px;
    background: var(--color-accent);
    min-width: 22px;
    padding: 5px 8px;
    font-size: 14px;
    color: #fbf6ff;
    border-radius: 5px;
    text-align: center;
    line-height: 1;
  }
}

</style>
