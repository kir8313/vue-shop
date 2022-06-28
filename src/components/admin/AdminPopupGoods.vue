<template>
  <div class="bg" @click="closePopup($event)">
    <form class="form" @submit.prevent="onSubmit">
      <button class="btn-close" type="button" @click="$emit('closePopup', hasChanges)"></button>
      <h1>{{ Object.keys(good).length ? 'Изменить' : 'Создать' }} товар</h1>
      <div v-if="!iError && img" class="mb-3">
        <img class="form__img" :src="imgUrl" alt="Не верный url для картинки">
      </div>
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
          @change="returnUrlImg"
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
      <button class="btn btn-primary me-2" type="submit" :disabled="isSubmitting || !hasChanges">{{
          popupStatus
        }}
      </button>
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
import {computed, onMounted, ref, watch, proxyRefs, reactive} from "vue";
import {useRouter} from "vue-router";
import * as yup from "yup";

const emit = defineEmits(["closePopup"]);
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

const {value: title, errorMessage: tError, handleBlur: tBlur} = useField("title",
  yup
    .string()
    .trim()
    .required("Введите название товара")
    .test("isUnique", "Товар с таким названием уже существует", el => {
      if (el && Object.keys(props.good).length === 0) {
        for (let good of store.getters["goods/goods"]) {
          if (good.title.toLowerCase() === el.toLowerCase()) {
            return false
          }
        }
      }
      return true
    })
)

const {value: img, errorMessage: iError, handleBlur: iBlur} = useField("img",
  yup
    .string("Введите путь к изображению")
    .url("Введите корректную ссылку на картинку")
    .trim()
    .required("Введите путь к изображению")
    .test("test-type", "Введите тип картинки на конце (webp, png, jpg, jpeg)", el => {
      if (el) {
        const lastEl = el.split('.')[el.split('.').length - 1];
        return ["webp", "png", "jpg", "jpeg"].includes(lastEl);
      }
    })
);

const {value: count, errorMessage: cError, handleBlur: cBlur} = useField("count",
  yup
    .number("Поле не должно быть пустым")
    .required("Введите количество товара")
    .min(0, "Минимальное количество 0")
);

const {value: price, errorMessage: pError, handleBlur: pBlur} = useField("price",
  yup
    .number()
    .required("Введите цену")
    .min(1, "Цена от 1 рубля")
);


const popupStatus = computed(() => {
  if (Object.keys(props.good).length) {
    return "Изменить";
  } else {
    return "Создать";
  }
})

const onSubmit = handleSubmit(async (values) => {
  if (Object.keys(props.good).length) {
    await store.dispatch("goods/putGood", {...values, id: props.good.id, "category": category.value});
  } else {
    const good = {...values, "category": category.value};
    await store.dispatch("goods/pushGood", good);
  }
  emit("closePopup");
})

const deleteGood = async () => {
  await store.dispatch("goods/deleteGood", props.good.id);
  emit("closePopup");
}

const closePopup = (event) => {
  if (!event.target.closest('.form')) {
    emit("closePopup", hasChanges.value)
  }
}

const hasChanges = computed(() => {
  return props.good.title !== title.value ||
    props.good.price !== price.value ||
    props.good.count !== count.value ||
    props.good.img !== img.value ||
    (props.good.category !== category.value &&
      category.value !== props.categories[0].type)
})

watch([count, price], ([cVal, pVal]) => {
  if (cVal === "") {
    count.value = 0;
  }
  if (pVal === "") {
    price.value = 0;
  }
})

onMounted(() => {
  if (Object.keys(props.good).length) {
    const {good} = props;
    title.value = good.title;
    img.value = good.img;
    count.value = good.count;
    price.value = good.price;
    category.value = good.category;

    imgUrl.value = good.img;
  }
})

const imgUrl = ref(null);
const returnUrlImg = (e) => imgUrl.value = e.target.value;
</script>

<style lang="scss">
body {
  overflow: hidden;
}

.bg {
  overflow-y: auto;
  padding-bottom: 50px;
}

.form__img {
  max-width: 150px;
}
</style>
