<template>
  <form class="form" @submit.prevent="onSubmit">
    <h1>Регистрация</h1>
    <div class="mb-3">
      <label class="form-label" for="email">Имя</label>
      <input
        class="form-control"
        :class="{invalid: nError}"
        type="text" id="name"
        v-model="name"
        @blur="nBlur"
        placeholder="Имя"
      >
      <small class="form-text" v-if="nError">{{ nError }}</small>
    </div>
    <div class="mb-3">
      <label class="form-label" for="email">Почта</label>
      <input
        class="form-control"
        :class="{invalid: eError}"
        type="email" id="email"
        v-model="email"
        @blur="eBlur"
        placeholder="Почта"
      >
      <small class="form-text" v-if="eError">{{ eError }}</small>
    </div>
    <div class="mb-3">
      <label class="form-label" for="password">Пароль</label>
      <input
        class="form-control"
        :class="{invalid: pError}"
        type="password" id="password"
        v-model="password"
        @blur="pBlur"
        placeholder="Пароль"
      >
      <small class="form-text" v-if="pError">{{ pError }}</small>
    </div>
    <div class="mb-3">
      Уже есть аккаунт?
      <router-link to="/auth" class="form__link">Войти</router-link>
    </div>
    <button class="btn btn-primary" type="submit" :disabled="isSubmitting || validSession">Создать</button>
    <p class="text-danger" v-if="validSession">
      Повторите попытку позже. Через {{ timerCount }} секунд.
    </p>
  </form>
</template>

<script setup>
import {useStore} from 'vuex'
import {useField, useForm} from "vee-validate";
import {computed, ref, watch, inject} from "vue";
import {useRouter} from "vue-router";
import * as yup from "yup";
import alerts from "@/utils/alerts";

const {handleSubmit, isSubmitting, submitCount} = useForm();
const store = useStore()
const TIMER = 10;
const timerCount = ref(TIMER);
const router = useRouter();
let SetTimer;
const $error = inject('$error');

const error = computed(() => {
  return store.getters.error;
})

watch(error, fbError => {
  $error(alerts[fbError.code] || 'Неожиданная ошибка')
})

const {value: name, errorMessage: nError, handleBlur: nBlur} = useField('name',
  yup
    .string()
    .trim()
    .required('Введите имя')
)

const {value: email, errorMessage: eError, handleBlur: eBlur} = useField('email',
  yup
    .string()
    .trim()
    .required('Введите email')
    .email('Введите корректный email')
);

const PASSWORD_LENGTH = 6;
const {value: password, errorMessage: pError, handleBlur: pBlur} = useField('password',
  yup
    .string()
    .trim()
    .required("Введите пароль")
    .min(PASSWORD_LENGTH, `Пароль должен содержать от ${PASSWORD_LENGTH} символов`)
);

const validSession = computed(() => submitCount.value >= 3);
watch(validSession, val => {
  if (val) {
    SetTimer = setInterval(() => timerCount.value--, 1000);
    let timer = setTimeout(() => {
      submitCount.value = 0;
      clearInterval(SetTimer);
      timerCount.value = TIMER;
      clearTimeout(timer);
    }, TIMER * 1000);
  }
})

const onSubmit = handleSubmit(async (values) => {
  try {
    await store.dispatch('register', values);
    await router.push('/');
  } catch (e) {}
})
</script>

<style scoped>
form {
  max-width: 600px;
  margin: 120px auto 0;
}

.form-text {
  color: red;
}

.form-control.invalid {
  border-color: red;
}
</style>
