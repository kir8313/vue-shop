<template>
  <div class="bg" @click="closePopup($event)">
    <form class="form margin-top" @submit.prevent="onSubmit">
      <button class="btn-close" @click="$emit('closePopup')"></button>
      <h1 class="mb-3">Оплатить заказ</h1>
      <div class="form-floating mb-3">
        <input
          class="form-control"
          :class="{'is-invalid': pError}"
          type="number"
          id="title"
          v-model.number="payCart"
          @blur="pBlur"
          placeholder="Номер карты"
        >
        <label class="form-label" for="title">Номер карты</label>
        <small class="form-text" v-if="pError">{{ pError }}</small>
      </div>
      <button class="btn btn-primary me-2" type="submit" :disabled="isSubmitting || !isValidPay">Оплатить</button>
    </form>
  </div>
</template>

<script setup>
import {useStore} from 'vuex'
import {useField, useForm} from "vee-validate";
import {computed, watch, inject} from "vue";
import {useRouter} from "vue-router";
import * as yup from "yup";
import alerts from "@/utils/alerts";

const emit = defineEmits(['closePopup']);
const props = defineProps({
  sumPrices: {
    required: true,
    type: Number,
  },
  order: {
    required: true,
  },
})

const {handleSubmit, isSubmitting, submitCount} = useForm();
const store = useStore()
const router = useRouter();
const $error = inject('$error');
const $alert = inject('$alert');

const {value: payCart, errorMessage: pError, handleBlur: pBlur} = useField('payCart',
  yup
    .number()
    .required('Введите данные карты')
    .min(16, 'Минимальное количество цифр 16')
)

const onSubmit = handleSubmit(async () => {
  try {
    await store.dispatch('cart/pushOrder', {
      time: new Date().toLocaleString(),
      userId: store.getters['auth/user'].id,
      sumPrices: props.sumPrices,
      list: props.order
    });

    $alert('Покупка прошла успешно!')
    emit('closePopup', true);
  } catch (e) {
    throw e;
  }
})

const closePopup = (event) => {
  if (event.target.closest('.form') === null) {
    emit('closePopup')
  }
}

watch(payCart, val => {
  if (val === "") {
    payCart.value = 0;
  }
  if (String(val).length > 16) {
    payCart.value = +String(val).slice(0, 16);
  }
})

const isValidPay = computed(() => payCart.value && String(payCart.value).length === 16);

const error = computed(() => {
  return store.getters.error;
})

watch(error, fbError => {
  $error(alerts[fbError.code] || `Неожиданная ошибка (${fbError.code})`)
})
</script>

<style scoped>
.margin-top {
  margin-top: 10%;
}
</style>
