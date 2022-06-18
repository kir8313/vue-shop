<template>
  <app-loader
    v-if="isLoading"
  />
  <section v-else>
    <div class="container">
      <div class="basket">
        <h1>Корзина</h1>
        <h2 v-if="!cartModel" class="text-center">В корзине пока ничего нет</h2>
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
          <div
            v-if="isAuth"
            class="text-end"
          >
            <button class="btn btn-primary">Оплатить</button>
          </div>
          <div v-else>
            <h3 class="text-center mb-2">Для покупки авторизуйтесь</h3>
            <auth
              v-if="showForm === 'auth'"
              :is-cart="true"
              @onShowForm="showForm = 'register'"
            />
            <register
              v-else-if="showForm === 'register'"
              :is-cart="true"
              @onShowForm="showForm = 'auth'"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import {computed, onMounted, ref} from "vue";
import {useStore} from "vuex";
import CartGood from "@/components/cart/CartGood";
import Auth from "@/views/Auth";
import Register from "@/views/Register";
import AppLoader from "@/components/AppLoader";
const showForm = ref('auth')

const store = useStore();
const cartModel = ref(store.getters['cart/cart']);
const cartGoods = ref(null);
const isAuth = computed(() => store.getters['auth/user']);
const isLoading = ref(true);


const updateCartModel = () => {
  cartModel.value = store.getters['cart/cart'];
}

const deleteGood = (id) => {
  store.commit('cart/deleteGoodFromCart', id);
  cartModel.value = store.getters['cart/cart'];
  cartGoods.value = cartGoods.value.filter(good => good.id !== id);
}

const sumPrices = computed(() => {
  if (cartGoods.value) {
    return cartGoods.value.reduce((accum, good) => accum += good.price * cartModel.value[good.id], 0)
  } else {
    return 0
  }
})

onMounted(async () => {
  if (cartModel.value) {
    cartGoods.value = await store.dispatch('goods/getFilterGoods', cartModel.value);
  }
  isLoading.value = false;
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

.form {
  margin: 0 auto;
}
</style>
