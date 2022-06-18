<template>
    <div>
      <img
        class="good__img"
        :src="imgSrc"
        alt="title">
      {{ title }}
    </div>
    <div>
      <button v-if="isDecrement" class="btn btn-danger btn_sum" @click="$emit('deleteGood', id)">
        <img class="trash" src="@/assets/trash-can.svg" alt="Удалить">
      </button>
      <button v-else class="btn btn-danger btn_sum" @click="decrement">
        -
      </button>
      <span class="count">{{ countGoods }} шт.</span>
      <button
        :disabled="countGoods >= allCount"
        class="btn btn-primary btn_sum"
        @click="increment"
      >
        +
      </button>
      <p
        v-if="countGoods >= allCount"
        class="limit"
      >
        Максимальное количество товара: {{ allCount }}
      </p>
    </div>
    <div>{{ sum }} руб.</div>
</template>

<script setup>
import {computed, ref} from "vue";
import {useStore} from "vuex";

const props = defineProps({
  good: {
    required: true,
    type: Object,
  },

  count: {
    required: true,
    type: Number,
  },
})
const {id, img: imgSrc, count: allCount, title, price} = props.good;
const emit = defineEmits(['update-model', 'deleteGood']);
const store = useStore();

const countGoods = ref(props.count);

const decrement = () => {
  countGoods.value--;
  store.commit('cart/ChangeGoodCountInCart', {type: 'decrement', id});
  emit('update-model')
};

const increment = () => {
  if (countGoods.value < allCount) {
    countGoods.value++;
    store.commit('cart/ChangeGoodCountInCart', {type: 'increment', id});
    emit('update-model');
  }
};

const sum = computed(() => countGoods.value * price);

const isDecrement = computed(() => countGoods.value <= 1);
</script>

<style scoped>

</style>
