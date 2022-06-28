<template>
  <form class="form" @submit.prevent="onSubmit">
    <h1 class="text-black">Регистрация</h1>
    <div class="form-floating mb-3">
      <input
        class="form-control"
        :class="{invalid: nError}"
        type="text" id="name"
        v-model="name"
        @blur="nBlur"
        placeholder="Имя"
      >
      <label class="form-label" for="email">Имя</label>
      <small class="form-text" v-if="nError">{{ nError }}</small>
    </div>
    <div class="form-floating mb-3">
      <input
        class="form-control"
        :class="{invalid: eError}"
        type="email" id="email"
        v-model="email"
        @blur="eBlur"
        placeholder="Почта"
      >
      <label class="form-label" for="email">Почта</label>
      <small class="form-text" v-if="eError">{{ eError }}</small>
    </div>
    <div class="form-floating mb-3">
      <input
        class="form-control"
        :class="{invalid: pError}"
        type="password" id="password"
        v-model="password"
        @blur="pBlur"
        placeholder="Пароль"
      >
      <label class="form-label" for="password">Пароль</label>
      <small class="form-text" v-if="pError">{{ pError }}</small>
    </div>
    <div class="mb-3 text-black">
      Уже есть аккаунт?
      <router-link to="/auth" class="form__link">Войти</router-link>
    </div>
    <button class="btn btn-primary" type="submit" :disabled="isSubmitting || isValidSession">Создать</button>
    <p class="text-danger" v-if="isValidSession">
      Повторите попытку позже. Через {{ timerCount }} секунд.
    </p>
  </form>
</template>

<script setup>
import {useStore} from "vuex"
import {useField, useForm} from "vee-validate";
import {computed, ref, watch} from "vue";
import {useRouter} from "vue-router";
import * as yup from "yup";
import showError from "@/use/showError";

const {handleSubmit, isSubmitting, submitCount} = useForm();
const store = useStore();
const TIMER = 10;
const timerCount = ref(TIMER);
const router = useRouter();
let SetTimer;

showError();

const {value: name, errorMessage: nError, handleBlur: nBlur} = useField("name",
  yup
    .string()
    .trim()
    .required("Введите имя")
)

const {value: email, errorMessage: eError, handleBlur: eBlur} = useField("email",
  yup
    .string()
    .trim()
    .required("Введите email")
    .email("Введите корректный email")
);

const PASSWORD_LENGTH = 6;
const {value: password, errorMessage: pError, handleBlur: pBlur} = useField("password",
  yup
    .string()
    .trim()
    .required("Введите пароль")
    .min(PASSWORD_LENGTH, `Пароль должен содержать от ${PASSWORD_LENGTH} символов`)
);

const isValidSession = computed(() => submitCount.value >= 3);
watch(isValidSession, val => {
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
    await store.dispatch("auth/register", values);
    if (store.getters['auth/isAdmin']) {
      await router.push("/admin/goods");
    } else {
      await router.push("/cart");
    }
  } catch (e) {}
})
</script>
