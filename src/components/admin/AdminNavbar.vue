<template>
  <header class="header">
    <div class="container">
      <nav :class="[
          'navbar', 'flex-md-row', 'justify-content-md-between',
          isAuth? 'justify-content-between flex-column pt-2' : '',
        ]">
      <span class="navbar__logo">Админка</span>
      <ul class="nav">
        <li class="nav-item">Привет <b>{{ user.name }}!</b></li>
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
      </nav>
    </div>
  </header>
</template>

<script setup>
import {computed} from "vue";
import {useStore} from 'vuex'
import {useRouter} from "vue-router";

const store = useStore();
const router = useRouter();
const user = computed(() => store.getters["auth/user"]);

const isAuth = computed(() => store.getters["auth/isAuthenticated"])

const logout = () => {
  store.dispatch("auth/logout");
  router.push("/");
}

</script>
