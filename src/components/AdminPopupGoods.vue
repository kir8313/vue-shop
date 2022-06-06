<template>
  <div class="bg" @click="closePopup($event)">
    <form class="form" @submit.prevent="onSubmit">
      <h1>{{ Object.keys(props.good).length ? 'Изменить' : 'Создать' }} товар</h1>
      <div class="form-floating mb-3">
        <input
          class="form-control"
          :class="{'is-invalid': tError}"
          type="text"
          id="title"
          v-model="title"
          @blur="tBlur"
          placeholder="Название"
        >
        <label class="form-label" for="title">Название</label>
        <small class="form-text" v-if="tError">{{ tError }}</small>
      </div>
      <div class="form-floating mb-3">
        <input
          class="form-control"
          :class="{'is-invalid': iError}"
          type="text" id="img"
          v-model="img"
          @blur="iBlur"
          placeholder="Изображение"
        >
        <label class="form-label" for="img">Изображение</label>
        <small class="form-text" v-if="iError">{{ iError }}</small>
      </div>
      <div class="form-floating mb-3">
        <input
          class="form-control"
          :class="{'is-invalid': cError}"
          type="number" id="count"
          v-model.number="count"
          @blur="cBlur"
          placeholder="Количество"
        >
        <label class="form-label" for="count">Количество</label>
        <small class="form-text" v-if="cError">{{ cError }}</small>
      </div>
      <div class="form-floating mb-3">
        <input
          class="form-control"
          :class="{'is-invalid': pError}"
          type="number" id="price"
          v-model.number="price"
          @blur="pBlur"
          placeholder="Цена"
        >
        <label class="form-label" for="price">Цена</label>
        <small class="form-text" v-if="pError">{{ pError }}</small>
      </div>
      <div class="mb-3">
        <label class="form-label">Категория</label>
        <select class="form-select" aria-label="Выберите категорию" v-model="category">
          <option
            v-for="cat in categories"
            :value="cat.type"
          >
            {{ cat.title }}
          </option>
        </select>
      </div>
      <button class="btn btn-primary me-2" type="submit" :disabled="isSubmitting">{{ popupStatus }}</button>
      <button
        v-if="Object.keys(good).length"
        class="btn btn-danger" type="button"
        :disabled="isSubmitting"
        @click="deleteGood"
      >
        Удалить
      </button>
    </form>
  </div>
</template>

<script setup>
import {useStore} from 'vuex'
import {useField, useForm} from "vee-validate";
import {computed, onMounted, ref, watch} from "vue";
import {useRouter} from "vue-router";
import * as yup from "yup";
import {logout} from "@/utils/firebase.config";

const emit = defineEmits(['closePopup']);
const props = defineProps({
  categories: {
    required: true,
    type: Array,
  },

  good: {
    required: true,
    type: Object,
  },
})

const {handleSubmit, isSubmitting, submitCount} = useForm();
const store = useStore()
const router = useRouter();
const category = ref(props.categories[0].type);

const {value: title, errorMessage: tError, handleBlur: tBlur} = useField('title',
  yup
    .string()
    .trim()
    .required('Введите название товара')
    .test('isUnique', 'Товар с таким названием уже существует', el => {
      if (el && Object.keys(props.good).length === 0) {
        for (let good of store.getters.goods) {
          if (good.title.toLowerCase() === el.toLowerCase()) {
            return false
          }
        }
      }
      return true
    })
)

const {value: img, errorMessage: iError, handleBlur: iBlur} = useField('img',
  yup
    .string('Введите путь к изображению')
    .required('Введите путь к изображению')
    .url('Введите корректную ссылку на картинку')
    .trim()
    .test('test-type', 'Введите тип картинки на конце (webp, png, jpg, jpeg)', el => {
      if (el) {
        const lastEl = el.split('.')[el.split('.').length - 1]
        return ['webp', 'png', 'jpg', 'jpeg'].includes(lastEl);
      }
    })
);

const {value: count, errorMessage: cError, handleBlur: cBlur} = useField('count',
  yup
    .number('Поле не должно быть пустым')
    .required('Введите количество товара')
    .min(0, `Минимальное количество 0`)
);

const {value: price, errorMessage: pError, handleBlur: pBlur} = useField('price',
  yup
    .number()
    .required('Введите цену')
    .min(1, `Цена от 1 рубля`)
);

const popupStatus = computed(() => {
  if (Object.keys(props.good).length) {
    return 'Изменить';
  } else {
    return 'Создать';
  }
})

const onSubmit = handleSubmit(async (values) => {
  if (Object.keys(props.good).length) {
    await store.dispatch('putGood', {...values, id: props.good.id, "category": category.value});
  } else {
    const id = String(store.getters.goods.length + 1);
    const good = {...values, id, "category": category.value};
    await store.dispatch('pushGood', good);
  }
  emit('closePopup');
})

const deleteGood = async () => {
  console.log('delete')
  await store.dispatch('deleteGood', props.good.id);
  emit('closePopup');
}

const closePopup = (event) => {
  if (event.target.closest('.form') === null) {
    emit('closePopup')
  }
}

watch(count, val => {
  if (val === "") {
    count.value = 0;
  }
})
watch(price, val => {
  if (val === "") {
    price.value = 0;
  }
})

onMounted(() => {
  if (Object.keys(props.good).length) {
    const {good} = props;
    title.value = good.title
    img.value = good.img
    count.value = good.count
    price.value = good.price
    category.value = good.category;
  }
})
</script>

<style scoped lang="scss">
.bg {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 999;
  cursor: pointer;
}

form {
  max-width: 600px;
  margin: 120px auto 0;
  background: white;
  text-align: left;
  cursor: default;
}

.form-text {
  color: red;
}

.form-label {
  color: gray;
}

.form-control.is-invalid {
  border-color: red;
  border-width: 2px;
}
</style>
