<template>
  <header class="header">
    <div class="container">
      <nav
        :class="[
          'navbar', 'flex-md-row', 'justify-content-md-between',
          isAuth? 'justify-content-between flex-column pt-2' : '',
        ]"
      >
        <span class="navbar__logo">ShopArz</span>
        <ul class="nav">
          <li v-if="store.getters['auth/isAuthenticated']" class="nav-item fw-bold">{{ store.getters['auth/user'].name }}</li>
          <li class="nav-item">
            <router-link to="/" class="nav-link">Магазин</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/cart" class="nav-link nav-link_basket">
              Корзина
              <span v-if="store.getters['cart/cartLength']">{{ store.getters['cart/cartLength'] }}</span>
            </router-link>
          </li>
          <li v-if="isAuth" class="nav-item">
            <a href="/auth" class="nav-link" @click.prevent="logout">Выйти</a>
          </li>
        </ul>
      </nav>
    </div>
  </header>
</template>

<script setup>
import {useStore} from "vuex"
import {useRouter} from "vue-router";
import {computed} from "vue";

const store = useStore();
const router = useRouter();

const logout = () => {
  store.dispatch("auth/logout");
  router.push("/");
}

const isAuth = computed(() => store.getters["auth/isAuthenticated"])
</script>

