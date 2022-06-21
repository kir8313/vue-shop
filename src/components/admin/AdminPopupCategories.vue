<template>
  <div class="bg" @click="closePopup($event)">
    <form class="form" @submit.prevent="onSubmit">
      <button class="btn-close" type="button" @click="$emit('closePopup')"></button>
      <h1>{{ Object.keys(props.category).length ? 'Изменить' : 'Создать' }} товар</h1>
      <div class="form-floating mb-3">
        <input
          class="form-control"
          :class="{'is-invalid': tError}"
          type="text"
          id="title"
          v-model="catTitle"
          @blur="tBlur"
          placeholder="Название"
        >
        <label class="form-label" for="title">Название</label>
        <small class="form-text" v-if="tError">{{ tError }}</small>
      </div>
      <div class="form-floating mb-3">
        <input
          class="form-control"
          :class="{'is-invalid': typeError}"
          type="text"
          id="type"
          v-model="catType"
          @blur="typeBlur"
          placeholder="Тип категории"
        >
        <label class="form-label" for="type">Тип категории</label>
        <small class="form-text" v-if="typeError">{{ typeError }}</small>
      </div>
      <button class="btn btn-primary me-2" type="submit" :disabled="isSubmitting || !hasChanges">{{ popupStatus }}</button>
      <button
        v-if="Object.keys(category).length"
        class="btn btn-danger" type="button"
        :disabled="isSubmitting"
        @click="deleteCategory"
      >
        Удалить
      </button>
    </form>
  </div>
</template>

<script setup>
import {useStore} from 'vuex'
import {useField, useForm} from "vee-validate";
import {computed, onMounted, ref} from "vue";
import {useRouter} from "vue-router";
import * as yup from "yup";

const emit = defineEmits(['closePopup']);
const props = defineProps({
  categories: {
    required: true,
    type: Array,
  },

  category: {
    required: true,
    type: Object,
  },
})

const {handleSubmit, isSubmitting, submitCount} = useForm();
const store = useStore()
const router = useRouter();
const category = ref(props.category);

const {value: catTitle, errorMessage: tError, handleBlur: tBlur} = useField('title',
  yup
    .string()
    .trim()
    .required('Введите название товара')
    .test('isUnique', 'Такое название уже существует', el => {
      if (el && Object.keys(category).length === 0) {
        for (let cat of store.getters['categories/categories']) {
          if (cat.title.toLowerCase() === el.toLowerCase()) {
            return false
          }
        }
      }
      return true
    })
)
const {value: catType, errorMessage: typeError, handleBlur: typeBlur} = useField('type',
  yup
    .string()
    .trim()
    .required('Введите тип товара')
    .test('isUnique', 'Такой тип уже существует', el => {
      if (el && Object.keys(category).length === 0) {
        for (let cat of store.getters['categories/categories']) {
          if (cat.type.toLowerCase() === el.toLowerCase()) {
            return false
          }
        }
      }
      return true
    })
)

const onSubmit = handleSubmit(async (values) => {
  if (Object.keys(props.category).length) {
    await store.dispatch('categories/putCategory', {...values, id: props.category.id});
  } else {
    await store.dispatch('categories/pushCategory', values);
  }
  emit('closePopup');
})


const popupStatus = computed(() => {
  if (Object.keys(props.category).length) {
    return 'Изменить';
  } else {
    return 'Создать';
  }
})

const deleteCategory = async () => {
  await store.dispatch('categories/deleteCategory', props.category.id);
  emit('closePopup');
}

const closePopup = (event) => {
  if (!event.target.closest('.form')) {
    emit('closePopup', hasChanges.value);
  }
}

const hasChanges = computed(() => {
  return (props.category.title !== catTitle.value && catTitle.value) ||
    (props.category.type !== catType.value && catType.value);
})

const title = computed(() => {
  return Object.keys(props.category).length ? 'Изменить' : 'Создать';
})

onMounted(() => {
  if (Object.keys(props.category).length) {
    catTitle.value = props.category.title;
    catType.value = props.category.type;
  }
})
</script>
