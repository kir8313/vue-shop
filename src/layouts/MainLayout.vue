<template>
  <div class="wrapper">
    <the-navbar/>
    <main>
      <router-view/>
    </main>
    <footer>
      © Магазин ShopArz, {{ new Date().getFullYear() }}
    </footer>
  </div>
</template>

<script setup>
import TheNavbar from "@/components/TheNavbar";
import {onMounted} from "vue";
import {useStore} from "vuex";

const store = useStore()

onMounted(async () => {
  await store.dispatch('getUser');
})
</script>
