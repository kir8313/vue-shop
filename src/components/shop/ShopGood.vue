<template>
  <article class="products-item">
    <router-link :to="'/product/' + good.id" class="products-item__img">
      <img :src="good.img" :alt="good.title">
    </router-link>
    <router-link :to="'/product/' + good.id" class="products-item-info">
      <p class="products-item-info__brand mt-2">{{ good.title }}</p>
      <p class="products-item-info__price">{{ isHaveGood(good.count, good.price) }} </p>
    </router-link>
    <div
      v-if="good.count !== 0"
      class="products-bottom"
    >
      <button
        v-if="!isAddToCart"
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
  </article>
</template>

<script setup>
import {computed, onMounted, ref} from "vue";
import {useStore} from "vuex";
import isHaveGood from "@/use/isHaveGood";

const props = defineProps({
  good: {
    required: true,
    type: Object,
  },
})
const count = ref(1);
const store = useStore();
const isAddToCart = ref(false);

const addToCart = () => {
  isAddToCart.value = true;
  store.commit('cart/addGoodInCart', props.good.id);
  console.log('cart', store.getters['cart/cart'])
}

const deleteToCart = () => {
  isAddToCart.value = false;
  store.commit('cart/deleteGoodFromCart', props.good.id);
  console.log('props.good.id', props.good.id)
  console.log('cart', store.getters['cart/cart']);
}

const decrement = () => {
  if (count.value > 1) {
    store.commit('cart/ChangeGoodCountInCart', {type: 'decrement', id: props.good.id});
    count.value = store.getters['cart/cart'][props.good.id]
    console.log('cart', store.getters['cart/cart'])
  }
};

const increment = () => {
  if (count.value < props.good.count) {
    store.commit('cart/ChangeGoodCountInCart', {type: 'increment', id: props.good.id});
    count.value = store.getters['cart/cart'][props.good.id];
    console.log('cart', store.getters['cart/cart'])
  }
};

const isDecrement = computed(() => count.value <= 1);

onMounted(async () => {
  if (store.getters['cart/cart']) {
    const getGoodFromCart = Object.entries(store.getters['cart/cart']).find(cartGood => cartGood[0] === props.good.id);
    if (getGoodFromCart) {
      count.value = getGoodFromCart[1];
      isAddToCart.value = true;
    }
  }
})
</script>
