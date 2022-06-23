<template>
  <component :is="layout + '-layout'" v-if="layout"/>
</template>

<script>
import AuthLayout from "@/layouts/AuthLayout";
import MainLayout from "@/layouts/MainLayout";
import AdminLayout from "@/layouts/AdminLayout";

export default {
  components: {
    MainLayout, AuthLayout, AdminLayout
  }
}
</script>

<script setup>

import {computed, ref} from "vue";
import {useRoute} from "vue-router";

const route = useRoute();
const layout = computed(() => route.meta.layout);

</script>
