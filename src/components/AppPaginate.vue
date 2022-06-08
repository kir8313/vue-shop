<template>
  <nav v-if="pages" aria-label="Page navigation example">
    <ul class="pagination justify-content-center m-0">
      <li class="page-item"><a class="page-link" href="#"><span aria-hidden="true">&laquo;</span></a></li>
      <li
        v-for="idx in pages"
        class="page-item"
        :class="{active: +route.query.page === idx}"
      >
        <a
          class="page-link"
          :href="'?page=' + idx"
          @click.prevent="onChangePage(idx)"
        >
          {{ idx }}
        </a>
      </li>
      <li class="page-item"><a class="page-link" href="#"><span aria-hidden="true">&raquo;</span></a></li>
    </ul>
  </nav>
</template>

<script setup>
import {useRoute, useRouter} from "vue-router";
import {onMounted} from "vue";

const props = defineProps({
  pages: {
    type: Number,
    required: true,
  }
})
const emit = defineEmits(['changePage'])

const router = useRouter();
const route = useRoute();

const onChangePage = (idx) => {
  router.replace({query: {page: idx}});
  emit('changePage', idx);
}

onMounted(() => {
  if (!route.query.page) {
    router.replace({query: {page: 1}})
  } else {
    emit('changePage', route.query.page);
  }
})
</script>
