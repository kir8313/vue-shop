<template>
  <section class="categories card">
    <div class="d-flex justify-content-between mb-4">
      <h2>Категории</h2>
      <button class="btn btn-primary" @click="createCategory">Создать</button>
    </div>
    <div class="categories-table">
      <div class="categories-table__head">
        <div>Название</div>
        <div>Действие</div>
      </div>
      <div
        v-if="categories"
        v-for="category in categories"
        class="categories-table__row"
        :key="category.id"
      >
        <div>{{ category.title }}</div>
        <div>
          <button class="btn btn-info" :data-id="category.id" @click="changeCategory($event)">Изменить</button>
        </div>
      </div>
    </div>
    <teleport to="body">
      <admin-popup-categories
        v-if="isShowPopup"
        :categories="categories"
        :category="category"
        @close-popup="onClosePopup"
      />
      <app-prompt
        v-if="prompt"
        title="Действительно закрыть попап?"
        @has-go="closePrompt"
      />
    </teleport>
  </section>
</template>

<script setup>
import {computed, onMounted, ref} from "vue";
import {useStore} from "vuex";
import AdminPopupCategories from "@/components/admin/AdminPopupCategories";
import AppPrompt from "@/components/AppPrompt";

const store = useStore();
const isShowPopup = ref(false);
const category = ref({});
const prompt = ref(false);

const createCategory = () => {
  category.value = {};
  isShowPopup.value = true;
}

const changeCategory = (event) => {
  category.value = store.getters['categories/categories'].find(item => item.id === event.target.getAttribute('data-id'));
  isShowPopup.value = true;
}

const categories = computed(() => store.getters['categories/categories'])

onMounted(async () => {
  await store.dispatch('categories/getCategories');
})

const onClosePopup = (value) => {
  if (value) {
    prompt.value = true;
  } else {
    isShowPopup.value = false;
  }
}

const closePrompt = (value) => {
  if (value) {
    isShowPopup.value = false;

  }
  prompt.value = false;
}

</script>

<style scoped lang="scss">
.categories {
  max-width: 400px;
  margin: 0 auto;
  border-radius: 20px;
  padding: 30px 20px;
  color: var(--dark);
  text-align: center;

  &-table {
    &__head {
      font-weight: bold;
    }

    &__head,
    &__row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      align-items: center;
      margin-bottom: 20px;
    }

    &__row {
      img {
        max-width: 50px;
      }
    }
  }
}

</style>
