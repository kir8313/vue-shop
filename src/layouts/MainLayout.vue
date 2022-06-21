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
</script>
