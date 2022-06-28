<template>
  <app-loader
    v-if="isLoading"
  />
  <h1 v-else-if="cartModel && !selectedGoods">Товары не найдены!</h1>
  <section v-else>
    <div class="container">
      <div class="basket">
        <h1>Корзина</h1>
        <h2 v-if="!store.getters['cart/cartLength']" class="text-center">Пока ничего нет</h2>
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
          <div
            v-else
            class="text-center"
          >
            <h3>Для покупки войдите в систему</h3>
            <router-link to="/auth" class="btn btn-primary">Войти</router-link>
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
import showError from "@/use/showError";

const isAuthWindow = ref(true);
const store = useStore();
const user = computed(() => store.getters["auth/user"]);
const cartModel = computed(() => store.getters["cart/cart"]);
const selectedGoods = computed(() => store.getters["goods/selectedGoods"]);
const isLoading = ref(true);
const $alert = inject("$alert");
const isShowPopup = ref(false);
const prompt = ref(false);

showError();

const sumPrices = computed(() => {
  if (selectedGoods.value && cartModel.value) {
    return selectedGoods.value.reduce((accum, good) => accum += good.price * cartModel.value[good.id], 0);
  } else {
    return 0;
  }
});

onMounted(async () => {
  if (cartModel.value) {
    try {
      await store.dispatch("goods/getFilterGoods", cartModel.value);
    } catch (e) {}
  }
  isLoading.value = false;
});

const onClosePopup = (value) => {
  if (!value) {
    prompt.value = true;
  } else {
    isShowPopup.value = false;
  }
};

const changeAuthWindow = () => isAuthWindow.value = !isAuthWindow.value;

const onPay = async () => {
  if (store.getters["auth/isAuthenticated"]) {
    try {
      await pay({
        description: "Покупка товаров в онлайн магазине",
        amount: sumPrices.value,
        accountId: user.value.email,
      })
      await store.dispatch("order/pushOrder", {
        time: new Date().toLocaleString(),
        userId: user.value.id,
        sumPrices: sumPrices.value,
        list: []
      })
      $alert("Покупка прошла успешно!");
    } catch (e) {
      console.log("Отмена платежа", e);
    }
  } else {
    await store.dispatch("auth/logout");
  }
}
</script>

<style scoped lang="scss">
.form {
  margin: 0 auto;
}

.basket {
  background: #fff;
  padding: 20px 15px;
  border-radius: 20px;
  color: var(--dark);
}

.basket__inner {
  display: grid;
  grid-template-columns: 0.5fr 1fr 0.5fr;
  row-gap: 10px;
  align-items: center;
}


@media (min-width: 768px) {
  .basket {
    padding: 20px;
  }
  .basket__inner {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
