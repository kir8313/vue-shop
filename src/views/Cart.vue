<template>
  <section>
    <div class="container">
      <div class="basket">
        <h1>Корзина</h1>
        <h3 v-if="!Object.keys(cartModel).length" class="text-center">В корзине пока ничего нет</h3>
        <div v-else>
          <div class="basket__inner text-center">
            <cart-good
              v-for="good in cartGoods"
              :count="cartModel[good.id]"
              :key=good.id
              :good="good"
              @delete-good="deleteGood"
              @update-model="updateCartModel"
            />
          </div>
          <hr/>
          <p class="text-end"><strong>Всего: {{ sumPrices }} руб.</strong></p>
          <p class="text-end">
            <button class="btn btn-primary">Оплатить</button>
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import {computed, onMounted, ref} from "vue";
import {useStore} from "vuex";
import CartGood from "@/components/CartGood";
import {watch} from "vue";

const store = useStore();
const cartModel = ref(store.getters['cart/cart'])
const cartGoods = ref([])

const updateCartModel = () => {
  cartModel.value = store.getters['cart/cart'];
}

const deleteGood = (id) => {
  store.commit('cart/deleteGoodFromCart', id);
  cartModel.value = Object.fromEntries(Object.entries(cartModel.value).filter(item => +item[0] !== +id));
  cartGoods.value = cartGoods.value.filter(good => +good.id !== +id);
  console.log('cart', store.getters['cart/cart'])
}

const sumPrices = computed(() => {
  if (Object.keys(cartGoods.value).length !== 0) {
    return Object.keys(cartModel.value).reduce((accum, id) => {
      return accum += cartGoods.value.find(good => +good.id === +id).price * cartModel.value[id];
    }, 0)
  } else {
    return 0
  }
})

onMounted(async () => {
  if (cartModel.value) {
    cartGoods.value = await store.dispatch('getFilterGoods', cartModel.value);
  }
})
</script>

<style lang="scss">
.basket {
  background: #fff;
  padding: 20px;
  border-radius: 20px;
  color: var(--dark);
}

.basket__inner {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  align-items: center;
}
</style>
