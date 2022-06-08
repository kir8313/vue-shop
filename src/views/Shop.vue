<template>
  <section class="products">
    <div class="container">
      <app-loader v-if="isLoading"/>
      <h2 v-if="!goods">
        Товары не найдены
      </h2>
      <div v-else class="products__inner">
        <shop-filter
          v-if="categories"
          :categories="categories"
          v-model="filters"
        />
        <div v-if="goods.length" class="products__cards">
          <shop-good
            v-for="good in goods"
            :key="good.id"
            :good="good"
          />
        </div>
        <h3 v-else class="text-center flex-grow-1">Нет товара по заданным фильтрам</h3>
      </div>
    </div>
  </section>
</template>

<script setup>
import {computed, onMounted, ref, watch} from "vue";
import {useStore} from "vuex"
import ShopGood from "@/components/shop/ShopGood";
import ShopFilter from "@/components/shop/ShopFilter";
import AppLoader from "@/components/AppLoader";

const store = useStore();
const categories = ref({});
const isLoading = ref(true);
const stateGoods = ref(store.getters.goods)
const goods = ref([]);
const filters = ref({});

watch([stateGoods, filters], ([newVal, {search, category}]) => {
  if (newVal) {
    let newGoods = store.getters.goods;

    if (search) {
      newGoods = newGoods.filter(good => good.title.toLowerCase().includes(search.toLowerCase()));
    }
    if (category) {
      newGoods = newGoods.filter(good => good.category === category);
    }

    goods.value = newGoods;
  }
})

onMounted(async () => {
  await store.dispatch('getAllGoods');
  stateGoods.value = store.getters.goods;
  await store.dispatch('getCategories');
  categories.value = store.getters.categories;
  isLoading.value = false;
})
</script>

<style lang="scss">
.products {
  &__inner {
    display: flex;
    align-items: flex-start;
  }

  &-filter {
    margin-right: 2rem;
    width: 300px;
    padding: 20px;
    background: white;
    border-radius: 20px;

    .list {
      margin: 0;
      padding: 0;
      list-style: none;
      color: var(--dark);
    }
  }

  &__cards {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 20px 10px;
    width: 100%;
    flex: 1;
  }

  &-item {
    max-width: 300px;
    background: white;
    display: flex;
    flex-direction: column;
    color: var(--dark);
    border-radius: 20px;
    padding: 15px 10px;

    &:hover .products-item__img {
      transform: scale(1.05);
    }

    &__img {
      flex: 1 1 auto;
      transition: transform 0.4s ease 0s;
    }

    &-info {
      color: var(--dark);
      text-decoration: none;

      &:hover {
        color: var(--dark);
      }

      p {
        margin-bottom: 0.5rem;
      }

      &__price {
        font-size: 20px;
      }
    }
  }

  &-bottom__btn {
    font-size: 14px;
    padding: 0.5rem 1.3rem;
  }
}

@media (min-width: 768px) {
  .products {
    &__cards {
      grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
      grid-gap: 30px 20px;
    }

    &-item {
      padding: 20px;

      &-info {
        flex: 1;

        &__brand {
          font-size: 16px;
        }

        &__price {
          font-size: 20px;
        }
      }
    }
  }
}

@media (max-width: 767px) {
  .main__container {
    max-width: none;
  }
}
</style>
