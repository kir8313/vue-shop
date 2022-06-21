<template>
  <div class="wrapper">
    <admin-navbar/>
    <main>
      <router-view/>
    </main>
    <footer>
      © Магазин ShopArz, {{ new Date().getFullYear() }}
    </footer>
  </div>
</template>

<script setup>
  import AdminNavbar from "@/components/admin/AdminNavbar";
</script>
