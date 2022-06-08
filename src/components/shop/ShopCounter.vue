<template>
  <button
    v-if="isDecrement"
    class="btn btn-danger btn_sum"
  >
    <!--    @click="$emit('app-delete', +id)"-->
    <img class="trash" src="@/assets/trash-can.svg" alt="Удалить">
  </button>
  <button v-else class="btn btn-danger btn_sum" @click="decrement">
    -
  </button>
  <span class="count">{{ count }} шт.</span>
  <button
    :disabled="counter >= allCount"
    class="btn btn-primary btn_sum"
    @click="increment"
  >
    +
  </button>
</template>

<script setup>
import {computed, ref} from "vue";

const props = defineProps({
  count: {
    type: Number,
    default: 0,
  },
  allCount: {
    required: true,
    type: Number,
  },
  id: {
    required: true,
    type: String,
  }
})

// const props = {
//   count: 0,
//   allCount: 10,
//   id: 1,
// }

const emit = defineEmits(['app-increment', 'app-decrement', 'app-delete']);

const counter = ref(props.count);

const decrement = () => {
  counter.value--;
  // emit('app-decrement', props.id);
};

const increment = () => {
  if (counter.value < props.allCount) {
    counter.value++;
    // emit('app-increment',props.id);
  }
};

const isDecrement = computed(() => counter.value <= 1);
</script>
