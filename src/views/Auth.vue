<template>
  <form class="form" @submit.prevent="onSubmit">
    <h1 v-if="!isCart" class="text-black">Вход</h1>
    <div class="form-floating mb-3">
      <input
        class="form-control"
        :class="{'is-invalid': eError}"
        type="email"
        id="email"
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
        :class="{'is-invalid': pError}"
        type="password" id="password"
        v-model="password"
        @blur="pBlur"
        placeholder="Пароль"
      >
      <label class="form-label" for="password">Пароль</label>
      <small class="form-text" v-if="pError">{{ pError }}</small>
    </div>
    <div class="mb-3">
      <a href="/register" class="form__link" @click.prevent="onRegister">Зарегистрироваться</a>
    </div>
    <button class="btn btn-primary" type="submit" :disabled="isSubmitting || validSession">Войти</button>
    <p class="text-danger" v-if="validSession">
      Повторите попытку позже. Через {{ timerCount }} секунд.
    </p>
  </form>
</template>

<script setup>
import {useStore} from "vuex"
import {useField, useForm} from "vee-validate";
import {computed, onMounted, ref, watch, inject} from "vue";
import {useRoute, useRouter} from "vue-router";
import * as yup from "yup";
import alerts from "@/utils/alerts";
import showError from "@/use/showError";

const {handleSubmit, isSubmitting, submitCount} = useForm();
const store = useStore();
const TIMER = 10;
const timerCount = ref(TIMER);
const router = useRouter();
const route = useRoute();
let SetTimer;
const $error = inject("$error");

showError();

const props = defineProps({
  isCart: Boolean,
})

const emit = defineEmits(["onShowForm"]);

const onRegister = () => {
  if (props.isCart) {
    emit("onShowForm");
  } else {
    router.push("/register");
  }
}

onMounted(() => {
  if (route.query.message) {
    $error(alerts[route.query.message]);
  }
})

const {value: email, errorMessage: eError, handleBlur: eBlur} = useField("email",
  yup
    .string()
    .trim()
    .required('Введите email')
    .email('Введите корректный email')
);

const PASSWORD_LENGTH = 6;
const {value: password, errorMessage: pError, handleBlur: pBlur} = useField("password",
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
    await store.dispatch("auth/login", values);
    if (!props.isCart) {
      await router.push("/admin/goods");
    }
  } catch (e) {}
})
</script>
