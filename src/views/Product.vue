<template>
  <app-loader v-if="isLoading"/>
  <div v-else>
    <h3
      v-if="!good"
      class="text-center text-white"
    >
      Товар не найден.
    </h3>
    <div class="card" v-else>
      <h1 class="card__title">{{ good.title }}</h1>
      <img class="card__img" :src="good.img"/>
      <p class="card__category">Категория: <strong>{{ showCurrentCategory(good.category, categories) }}</strong></p>
      <p class="card__price">{{ isHaveGood(good.count, good.price) }}</p>
      <div
        v-if="good.count !== 0"
        class="products-bottom"
      >
        <button
          v-if="!isAddToCart && good.selectedCount === undefined"
          class="products-bottom__btn btn btn-primary"
          @click="addToCart"
        >
          В корзину
        </button>
        <div v-else class="text-center">
          <button
            v-if="isDecrement"
            class="btn btn-danger btn_sum"
            @click="deleteToCart"
          >
            <img class="trash" src="@/assets/trash-can.svg" alt="Удалить">
          </button>
          <button v-else class="btn btn-danger btn_sum" @click="decrement">
            -
          </button>
          <span class="count">{{ count }} шт.</span>
          <button
            :disabled="count >= good.count"
            class="btn btn-primary btn_sum"
            @click="increment"
          >
            +
          </button>
          <p
            v-if="count >= good.count"
            class="limit"
          >
            Максимальное количество товара: {{ good.count }}
          </p>
        </div>
      </div>
    </div>
  </div>

</template>

<script setup>
import {onMounted, ref, computed} from "vue";
import {useRoute} from "vue-router";
import {useStore} from "vuex";
import AppLoader from "@/components/AppLoader";
import showCurrentCategory from "@/use/showCurrentCategory";
import isHaveGood from "@/use/isHaveGood";
import {logout} from "@/utils/firebase.config";

const store = useStore();
const route = useRoute();
const isLoading = ref(true);
const good = ref([]);
const categories = ref([])
const count = ref(1);
const isAddToCart = ref(false);

const addToCart = () => {
  isAddToCart.value = true;
  store.commit('cart/addGoodInCart', good.value.id);
  console.log('cart', store.getters['cart/cart'])
}

const deleteToCart = () => {
  isAddToCart.value = false;
  store.commit('cart/deleteGoodFromCart', good.value.id);
  console.log('cart', store.getters['cart/cart']);
}

const decrement = () => {
  count.value--;
  console.log('good.value.id', good.value)
  store.commit('cart/ChangeGoodCountInCart', {type: 'decrement', id: good.value.id});
  console.log('cart', store.getters['cart/cart']);
};

const increment = () => {
  if (count.value < good.value.count) {
    count.value++;
    store.commit('cart/ChangeGoodCountInCart', {type: 'increment', id: good.value.id});
    console.log('cart', store.getters['cart/cart']);
  }
};

const isDecrement = computed(() => count.value <= 1);

onMounted(async () => {
  if (store.getters.goods) {
    good.value = store.getters['goods/goods'].find(good => good.id === route.params.id);
  } else {
    good.value = await store.dispatch('goods/getGood', route.params.id);
  }

  const getGoodFromCart = store.getters['cart/cart'] ? store.getters['cart/cart'][route.params.id] : null;
  if (getGoodFromCart) {
    count.value = getGoodFromCart;
    isAddToCart.value = true;
  }

  if (!store.getters.categories) {
    await store.dispatch('categories/getCategories');
    categories.value = store.getters['categories/categories'];
  } else {
    categories.value = store.getters['categories/categories'];
  }
  isLoading.value = false;
})
</script>

<style scoped>
.card {
  max-width: 600px;
  margin: 0 auto;
  padding: 30px 20px;
  border-radius: 20px;
  color: var(--dark);
  text-align: center;
}

.card__img {
  display: block;
  margin: 0 auto;
  max-width: 200px;
}
</style>
