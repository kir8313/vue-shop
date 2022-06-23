<template>
  <app-loader v-if="isLoading"/>
  <section v-else class="products">
    <div class="container">
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
import {onMounted, ref, watch, computed} from "vue";
import {useStore} from "vuex";
import ShopGood from "@/components/shop/ShopGood";
import ShopFilter from "@/components/shop/ShopFilter";
import AppLoader from "@/components/app/AppLoader";
import showError from "@/use/showError";

const store = useStore();
const isLoading = ref(true);
const categories = computed(() => store.getters["categories/categories"]);
const stateGoods = computed(() => store.getters["goods/goods"]);
const goods = ref(stateGoods.value);
const filters = ref({});

showError();

watch([stateGoods, filters], ([newVal, {search, category}]) => {
  if (newVal) {
    let newGoods = stateGoods.value;
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
  if (!store.getters.goods) {
    try {
      await store.dispatch("goods/getAllGoods");
    } catch (e) {}
  }
  if (!store.getters.categories) {
    try {
    await store.dispatch("categories/getCategories");
    } catch (e) {}
  }
  isLoading.value = false;
})
</script>

<style lang="scss">
.products {
  &__inner {
    display: flex;
    flex-direction: column;
  }

  &__cards {
    display: flex;
    flex-wrap: wrap;
    margin: 0 -10px;
    flex: 1;
  }

  &-item {
    max-width: 44%;
    background: white;
    display: flex;
    flex-direction: column;
    color: var(--dark);
    border-radius: 20px;
    margin: 0 10px 20px;
    padding: 15px 10px;

    &:hover .products-item__img {
      transform: scale(1.1);
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
    &-item {
      padding: 20px;
      max-width: 210px;

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

@media (min-width: 992px) {
  .products .container {
    max-width: none;
  }

  .products__inner {
    flex-direction: row;
    align-items: flex-start;
  }
}

@media (min-width: 1400px) {
  .products .container {
    max-width: 1320px;
  }
}
</style>
