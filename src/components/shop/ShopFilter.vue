<template>
  <div class="products-filter">
    <div class="mb-1">
      <input
        class="products-filter__input form-control"
        type="search"
        placeholder="Найти товар..."
        v-model.trim="search"
      >
    </div>

    <ul class="list">
<!--      <li class="list-item">-->
<!--        <router-link-->
<!--          to="/"-->
<!--          :class="{active: !route.query.category || isActive('all')}"-->
<!--          @click="filterCategory('all')"-->
<!--        >-->
<!--          Все-->
<!--        </router-link>-->
<!--      </li>-->
<!--      <li-->
<!--        v-for="cat in categories"-->
<!--        :key="cat.id"-->
<!--        class="list-item"-->
<!--      >-->
<!--        <router-link :to="'/'" custom>-->
<!--          <a :class="{active: isActive(cat.type)}" @click="filterCategory(cat.type)">{{ cat.title }}</a>-->
<!--        </router-link>-->
<!--      </li>-->
      <li class="list-item">
        <label class="list-item__label">
          <input type="radio" value="all" v-model="category">
          <span>Все</span>
        </label>
      </li>
      <li
        class="list-item"
        v-for="cat in categories"
        :key="cat.id"
      >
        <label class="list-item__label">
          <input type="radio" :value="cat.type" v-model="category">
          <span>{{ cat.title }}</span>
        </label>
      </li>
    </ul>
  </div>
</template>

<script setup>
import {onMounted, ref, watch} from "vue";
import {useRoute, useRouter} from "vue-router";

const emit = defineEmits(['update:modelValue']);
const props = defineProps({
  categories: {
    required: true,
    type: Object,
  }
})

const route = useRoute();
const router = useRouter();
const search = ref('');
const category = ref('all')
const goods = ref([]);

watch([search, category], ([sh, cat]) => {
  const query = {};
  if (sh) {
    query['search'] = sh
  }
  if (cat && cat !== 'all') {
    query['category'] = cat
  }
  router.replace({query})
  emit('update:modelValue', {
    search: sh,
    category: cat === 'all' ? '' : cat
  })
})



const isActive = (type) => route.query.category === type;

onMounted( () => {
  if (route.query.search) {
    search.value = route.query.search;
  }
  if (route.query.category) {
    category.value = route.query.category
  }
})
</script>

<style scoped lang="scss">
.list-item {
  font-size: 18px;

  &__label {
    position: relative;
    transition: color 0.4s ease 0s, text-decoration;
    cursor: pointer;
    input {
      position: absolute;
      top: 0;
      left: 0;
      width: 1px;
      height: 1px;
      visibility: hidden;
    }

    input:checked ~ span {
      color: var(--bs-blue);
      pointer-events: none;
    }

    &:hover {
      color: var(--color-accent);
    }
  }
}
</style>
