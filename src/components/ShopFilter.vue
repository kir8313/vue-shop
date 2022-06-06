<template>
  <div class="products-filter">
    <div class="mb-1">
      <input class="products-filter__input form-control" type="search" placeholder="Найти товар..."
             v-model="searchInput">
    </div>

    <ul class="list">
      <li class="list-item">
        <router-link
          to="/"
          :class="{active: !route.query.category || isActive('all')}"
          @click="filterCategory('all')"
        >
          Все
        </router-link>
      </li>
      <li
        v-for="cat in categories"
        :key="cat.id"
        class="list-item"
      >
        <router-link :to="'/'" custom>
          <a :class="{active: isActive(cat.type)}" @click="filterCategory(cat.type)">{{ cat.title }}</a>
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script setup>
import {computed, onMounted, ref, watch} from "vue";
import {useRoute, useRouter} from "vue-router";
import {useStore} from "vuex";

const emit = defineEmits(['update:modelValue', 'filter-category']);
const props = defineProps({
  categories: {
    required: true,
    type: Object,
  }
})
const {dispatch, getters} = useStore();
const route = useRoute();
const router = useRouter();
const searchInput = ref('');
const goods = ref([]);

const filterCategory = (type) => {
  if (type !== 'all') {
    const newGoods = goods.value.filter(good => good.category === type);
    emit('update:modelValue', newGoods);
    changeQueryParams(searchInput.value.trim(), type);
  } else {
    emit('update:modelValue', goods.value);
    changeQueryParams(searchInput.value.trim(), "");
  }
}

const changeQueryParams = (search = route.query.search, category = route.query.category) => {
   if (search && category) {
    return router.push({query: { search, category}});
  } else if (search) {
    return router.push({query: {search}});
  } else if (category) {
    return router.push({query: {category}});
  }
}

watch(searchInput, searchOnInput);

function searchOnInput(next, prev) {
  if (next.trim() === "") {
    goods.value = getters.goods;
    router.push('/');
  } else if (next.length < prev.length) {
    changeQueryParams(next.trim());
    goods.value = getters.goods.filter(good => good.title.toLowerCase().includes(next.toLowerCase()));
  } else {
    changeQueryParams(next.trim());
    goods.value = goods.value.filter(good => good.title.toLowerCase().includes(next.toLowerCase()));
  }

  if (route.query.category) {
    filterCategory(route.query.category)
  } else {
    emit('update:modelValue', goods.value);
  }
}

const isActive = (type) => route.query.category === type;

onMounted(async () => {
  await dispatch('getAllGoods');
  goods.value = getters.goods;
  emit('update:modelValue', goods.value);

  if (route.query.search && route.query.category) {
    searchInput.value = route.query.search;
  } else if (route.query.search) {
    searchInput.value = route.query.search
  } else if (route.query.category) {
    filterCategory(route.query.category);
  }
})
</script>

<style scoped lang="scss">
.list-item {
  font-size: 18px;

  a {
    border: none;
    background-color: transparent;
    padding: 0;
    color: var(--dark);
    text-decoration: none;
    transition: color 0.4s ease 0s, text-decoration;
    cursor: pointer;

    &:hover {
      color: var(--color-accent);
    }

    &:focus-visible {
      outline: none;
      text-decoration: underline;
      text-underline-position: under;
      text-underline-offset: 2px;

    }

    &.active {
      color: var(--bs-blue);
      pointer-events: none;
    }
  }
}
</style>
