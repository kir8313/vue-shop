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
              v-for="good in selectedGoods"
              :count="cartModel[good.id]"
              :key=good.id
              :good="good"
            />
          </div>
          <hr/>
          <p class="text-end"><strong>Всего: {{ sumPrices }} руб.</strong></p>
          <div
            v-if="isAuth"
            class="text-end"
          >
            <button class="btn btn-primary" @click="onShowPopup">Оплатить</button>
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
    <teleport to="body">
        <cart-order
          v-if="isShowPopup"
          :sum-prices="sumPrices"
          :order="order"
          @close-popup="onClosePopup"
        />
      <app-prompt
        v-if="prompt"
        title="Действительно закрыть оплату?"
        @has-go="closePrompt"
      />
    </teleport>
  </section>
</template>

<script setup>
import {computed, onMounted, ref} from "vue";
import {useStore} from "vuex";
import CartGood from "@/components/cart/CartGood";
import Auth from "@/views/Auth";
import Register from "@/views/Register";
import AppLoader from "@/components/AppLoader";
import AppPrompt from "@/components/AppPrompt";
import CartOrder from "@/components/cart/CartOrder";
const showForm = ref('auth')

const store = useStore();
const cartModel = computed(() => store.getters['cart/cart']);
const selectedGoods = computed(() => store.getters['goods/selectedGoods']);
const isAuth = computed(() => Object.keys(store.getters['auth/user']).length);
const isLoading = ref(true);

const isShowPopup = ref(false);
const prompt = ref(false);
const order = computed(() => store.getters['cart/order']);

const sumPrices = computed(() => {
  if (selectedGoods.value && cartModel.value) {
    return selectedGoods.value.reduce((accum, good) => accum += good.price * cartModel.value[good.id], 0)
  } else {
    return 0
  }
})

onMounted(async () => {
  if (cartModel.value) {
    await store.dispatch('goods/getFilterGoods', cartModel.value);
  }
  isLoading.value = false;
})


const onShowPopup = () => {
  store.commit('cart/changeOrder', selectedGoods.value);
  isShowPopup.value = true;
}

const onClosePopup = (value) => {
  if (!value) {
    prompt.value = true;
  } else {
    isShowPopup.value = false;
  }
}

const closePrompt = (value) => {
  if (value) {
    isShowPopup.value = false
  }
  prompt.value = false;
}
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

<style scoped>

.form {
  margin: 0 auto;
}
</style>
