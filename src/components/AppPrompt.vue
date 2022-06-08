<template>
  <div class="bg" @click="closePopup($event)">
    <div class="card prompt">
      <h2 class="mb-3 text-center">{{ title }}</h2>
      <div class="d-flex justify-content-center">
      <button class="btn btn-primary me-3" @click="$emit('hasGo', true)">Да</button>
      <button class="btn btn-danger" @click="$emit('hasGo', false)">Нет</button>
      </div>
    </div>
  </div>
</template>

<script setup>
const emit = defineEmits(['hasGo']);
const props = defineProps({
  title: {
    type: String,
    default: 'Покинуть страницу?'
  }
})

const closePopup = (event) => {
  if (event.target.closest('.card') === null) {
    emit('hasGo', true)
  }
}
</script>

<style scoped>
  .bg {
    z-index: 100;
  }
</style>
