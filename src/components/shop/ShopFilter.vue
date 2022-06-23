<template>
  <div>
    <div class="d-flex justify-content-end mb-3 d-lg-none">
      <button
        v-if="isUsedFilters"
        class="products-filter__btn red"
        @click="clearFilters"
      >
        Сбросить
      </button>
      <button
        class="products-filter__btn"
        @click="isShowFilter = true"
      >
        Фильтр
      </button>
    </div>
    <div class="products-filter" :class="{'--show': isShowFilter}">
      <button class="products-filter__btn-close btn-close d-lg-none" @click="isShowFilter = false"></button>
      <div class="mb-3">
        <input
          class="products-filter__input form-control"
          type="search"
          placeholder="Найти товар..."
          v-model.trim="search"
        >
      </div>
      <ul class="list">
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
      <button
        v-if="isUsedFilters"
        class="products-filter__btn d-lg-none m-auto"
        @click="isShowFilter = false"
      >
        Показать результаты
      </button>
    </div>
  </div>
</template>

<script setup>
import {computed, onMounted, ref, watch} from "vue";
import {useRoute, useRouter} from "vue-router";

const emit = defineEmits(["update:modelValue"]);
const props = defineProps({
  categories: {
    required: true,
    type: Object,
  },
  modelValue: Object,
})

const route = useRoute();
const router = useRouter();
const search = ref("");
const category = ref("all");
const isShowFilter = ref(false);

watch([search, category], ([sh, cat]) => {
  const query = {};
  if (sh) {
    query["search"] = sh;
  }
  if (cat && cat !== "all") {
    query["category"] = cat;
  }
  router.replace({query})
  emit("update:modelValue", {
    search: sh,
    category: cat === "all" ? "" : cat
  })
})

const isActive = (type) => route.query.category === type;

onMounted( () => {
  if (route.query.search) {
    search.value = route.query.search;
  }
  if (route.query.category) {
    category.value = route.query.category;
  }
})

const clearFilters = () => {
  search.value = ""
  category.value = "all"
}
const isUsedFilters = computed(() => route.query.search || route.query.category)
</script>

<style scoped lang="scss">
.products {
  &-filter {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 15;
    padding: 60px 15px 20px;
    background: white;
    transform: translateX(-105%);
    will-change: transform;
    transition: transform 0.6s ease 0s;

    &.--show {
      transform: translateX(0);
    }

    .list {
      margin: 0;
      padding: 0;
      list-style: none;
      color: var(--dark);
    }

    &__btn {
      background: var(--color-accent);
      display: block;
      margin-right: 0.5rem;
      padding: 0.5rem 1.3rem;
      color: var(--white);
      border-radius: 10px;
      border: none;
      font-size: 14px;
      &.red {
        background: var(--bs-red);
      }
    }

    &__btn-close {
      position: absolute;
      top: 10px;
      right: 10px;
    }
  }
}
.list-item {
  margin-bottom: 10px;
  font-size: 16px;

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

@media (min-width: 768px) {
  .list-item {
    font-size: 18px;
  }
}

@media (min-width: 992px) {
  .products-filter {
    position: static;
    width: 300px;
    margin-right: 2rem;
    border-radius: 20px;
    padding: 20px;
    transform: translateX(0);
  }
  .list-item {
    margin-bottom: 0;
  }
}
</style>
