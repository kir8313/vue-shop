<template>
    <div>
      <img
        class="good__img"
        :src="imgSrc"
        alt="title">
      {{ title }}
    </div>
    <div>
      <button v-if="isDecrement" class="btn btn-danger btn_sum" @click="deleteGood">
        <img class="trash" src="@/assets/trash-can.svg" alt="Удалить">
      </button>
      <button v-else class="btn btn-danger btn_sum" @click="decrement">
        -
      </button>
      <span class="count">{{ countGoods }} кг</span>
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
        Лимит: {{ allCount }}
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
const emit = defineEmits(["deleteGood"]);
const store = useStore();

const countGoods = ref(props.count);

const decrement = () => {
  countGoods.value--;
  store.commit("cart/changeGoodCountInCart", {type: "decrement", id});
};

const increment = () => {
  if (countGoods.value < allCount) {
    countGoods.value++;
    store.commit("cart/changeGoodCountInCart", {type: "increment", id});
  }
};

const deleteGood = () => {
  store.commit("goods/deleteSelectedGoods", id);
  store.commit("cart/deleteGoodFromCart", id);
}

const sum = computed(() => countGoods.value * price);

const isDecrement = computed(() => countGoods.value <= 1);
</script>

<style scoped lang="scss">

.good__img {
  max-width: 50px;
}

@media (min-width: 768px) {
  .good__img {
    max-width: 100px;
    margin-right: 1rem;
  }
}
</style>
