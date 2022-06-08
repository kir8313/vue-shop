<template>
  <app-loader v-if="isLoading"/>
  <section v-else class="goods card">
    <div class="d-flex justify-content-between mb-4">
      <h2>Инвентарь</h2>
      <button class="btn btn-primary" @click="createGood">Создать</button>
    </div>
    <div class="goods-table">
      <div class="goods-table__head">
        <div>#</div>
        <div>Название</div>
        <div>Картинка</div>
        <div>Цена</div>
        <div>Категория</div>
        <div>Количество</div>
        <div>Действие</div>
      </div>
      <div
        v-if="filterGoods"
        v-for="good in partGoods"
        class="goods-table__row"
        :key="good.id"
      >
        <div>{{ good.id }}</div>
        <div>{{ good.title }}</div>
        <div><img :src="good.img" :alt="good.title"></div>
        <div>{{ good.price }} ₽</div>
        <div>{{ showCurrentCategory(good.category, categories) }}</div>
        <div>{{ good.count }}</div>
        <div>
          <button class="btn btn-info" :data-id="good.id" @click="changeGood($event)">Изменить</button>
        </div>
      </div>
      <admin-popup-goods
        v-if="isShowPopup"
        :categories="categories"
        :good=good
        @close-popup="onClosePopup"
      />
      <app-prompt
        v-if="prompt"
        title="Действительно закрыть попап?"
        @has-go="closePrompt"
      />
    </div>
    <app-paginate
      v-if="filterGoods"
      :pages="pages.length"
      @change-page="onChangePage"
    />
  </section>
</template>

<script setup>
import {computed, onMounted, ref, watch} from "vue";
import {useStore} from "vuex";
import showCurrentCategory from "@/use/showCurrentCategory";
import AdminPopupGoods from "@/components/admin/AdminPopupGoods";
import AppPrompt from "@/components/AppPrompt";
import AppPaginate from "@/components/AppPaginate";
import chunk from "lodash.chunk";
import AppLoader from "@/components/AppLoader";
import usePagination from "@/use/usePagination";

const isLoading = ref(true);
const store = useStore();
const categories = ref([]);
const isShowPopup = ref(false);
const good = ref({});
const prompt = ref(false);

const createGood = () => {
  good.value = {};
  isShowPopup.value = true;
}

const changeGood = (event) => {
  good.value = store.getters.goods.find(item => +item.id === +event.target.getAttribute('data-id'));
  isShowPopup.value = true;
}

const filterGoods = computed(() => {
  if (store.getters.goods) {
    return store.getters.goods.sort((a, b) => {
      if (+a.id < +b.id) {
        return -1
      } else if (+b.id < +a.id) {
        return 1
      }
    });
  }
  return null
})

onMounted(async () => {
  await store.dispatch('getAllGoods');
  await store.dispatch('getCategories');
  categories.value = store.getters.categories;
  isLoading.value = false;
})

const onClosePopup = (value) => {
  if (value) {
    prompt.value = true;
  } else {
    isShowPopup.value = false
  }
}

const closePrompt = (value) => {
  if (value) {
    isShowPopup.value = false
  }
  prompt.value = false;
}

//paginate ============================================================================================================
const PAGES_COUNT = 6

const pages = computed(() => {
    return chunk(filterGoods.value, PAGES_COUNT)
})

const partGoods = ref(null);

computed(() => partGoods.value = pages.value[0])
const onChangePage = (idx) => {
  partGoods.value = pages.value[idx - 1];
}
</script>

<style lang="scss">
.goods {
  max-width: 1000px;
  margin: 0 auto;
  border-radius: 20px;
  padding: 30px 20px;
  color: var(--dark);

  &-table {
    &__head {
      font-weight: bold;
    }

    &__head,
    &__row {
      display: grid;
      grid-template-columns: 0.5fr repeat(6, 1fr);
      align-items: center;
      gap: 20px 0;
      text-align: center;
      margin-bottom: 20px;
    }

    &__row {
      img {
        max-width: 50px;
      }
    }
  }
}

.btn-info {
  transition: color 0.4s ease 0s;
}
</style>
