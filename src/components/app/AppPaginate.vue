<template>
  <nav v-if="pages" aria-label="Page navigation example">
    <ul class="pagination justify-content-center m-0">
      <li
        class="page-item">
        <button
          class="page-link"
          :disabled="+route.query.page <= 1"
          @click="emit('update:modelValue', +route.query.page - 1)"
        >
          <span aria-hidden="true">&laquo;</span>
        </button></li>
      <li
        v-for="idx in pages"
        class="page-item"
        :class="{active: idx === modelValue}"
      >
        <button
          class="page-link"
          @click.prevent="emit('update:modelValue', idx);"
        >
          {{ idx }}
        </button>
      </li>
      <li class="page-item">
        <button
          class="page-link"
          @click="emit('update:modelValue', +route.query.page + 1)"
          :disabled="+route.query.page >= pages"
        >
          <span aria-hidden="true">&raquo;</span>
        </button></li>
    </ul>
  </nav>
</template>

<script setup>
import {useRoute, useRouter} from "vue-router";
import {computed} from "vue";

const props = defineProps({
  goodsLength: {
    type: Number,
    required: true,
  },
  size: {
    type: Number,
    required: true,
  },
  modelValue: Number
})
const emit = defineEmits(['update:modelValue',])

const router = useRouter();
const route = useRoute();
const pages = computed(() => Math.ceil(props.goodsLength / props.size));
</script>

<style scoped>
.page-link:disabled {
  background: rgba(128, 128, 128, 0.5);
  cursor: not-allowed;
}
</style>
