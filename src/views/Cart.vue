<template>
  <app-loader
    v-if="isLoading"
  />
  <section v-else>
    <div class="container">
      <div class="basket">
        <h1>Корзина</h1>
        <h2 v-if="!store.getters['cart/cartLength']" class="text-center">В корзине пока ничего нет</h2>
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
            v-if="store.getters['auth/isAuthenticated']"
            class="text-end"
          >
            <button class="btn btn-primary" @click="onPay">Оплатить</button>
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
import {computed, onMounted, ref, inject} from "vue";
import {useStore} from "vuex";
import CartGood from "@/components/cart/CartGood";
import Auth from "@/views/Auth";
import Register from "@/views/Register";
import AppLoader from "@/components/app/AppLoader";
import {pay} from "@/utils/pay";

const showForm = ref('auth')
const store = useStore();
const user = computed(() => store.getters['auth/user']);
const cartModel = computed(() => store.getters['cart/cart']);
const selectedGoods = computed(() => store.getters['goods/selectedGoods']);
const isLoading = ref(true);
const $alert = inject('$alert');
const isShowPopup = ref(false);
const prompt = ref(false);

const sumPrices = computed(() => {
  if (selectedGoods.value && cartModel.value) {
    return selectedGoods.value.reduce((accum, good) => accum += good.price * cartModel.value[good.id], 0);
  } else {
    return 0;
  }
})

onMounted(async () => {
  if (cartModel.value) {
    await store.dispatch('goods/getFilterGoods', cartModel.value);
  }
  isLoading.value = false;
})

const onClosePopup = (value) => {
  if (!value) {
    prompt.value = true;
  } else {
    isShowPopup.value = false;
  }
}

const onPay = async () => {
  if (store.getters['auth/isAuthenticated']) {
    try {
      await pay({
        description: 'Покупка товаров в онлайн магазине',
        amount: sumPrices.value,
        accountId: user.value.email,
      })
      await store.dispatch('order/pushOrder', {
        time: new Date().toLocaleString(),
        userId: user.value.id,
        sumPrices: sumPrices.value,
        list: []
      })
      $alert('Покупка прошла успешно!');
    } catch (e) {
      console.log('Отмена платежа: ', e)
    }
  } else {
    await store.dispatch('auth/logout');
  }
}
</script>

<style scoped lang="scss">
.form {
  margin: 0 auto;
}

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

