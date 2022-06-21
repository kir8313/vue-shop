<template>
  <app-loader v-if="isLoading"/>
  <section v-else class="goods card">
    <div class="d-flex justify-content-between mb-4">
      <h2>Инвентарь</h2>
      <button class="btn btn-primary" @click="createGood">Создать</button>
    </div>
    <div class="goods-table">
      <div class="goods-table__head">
        <div>Название</div>
        <div>Картинка</div>
        <div>Цена</div>
        <div>Категория</div>
        <div>Количество</div>
        <div>Действие</div>
      </div>
      <div
        v-if="goods"
        v-for="good in goods"
        class="goods-table__row"
        :key="good.id"
      >
        <div>{{ good.title }}</div>
        <div><img :src="good.img" :alt="good.title"></div>
        <div>{{ good.price }} ₽</div>
        <div>{{ showCurrentCategory(good.category, categories) }}</div>
        <div>{{ good.count }}</div>
        <div>
          <button class="btn btn-info" :data-id="good.id" @click="changeGood($event)">Изменить</button>
        </div>
      </div>
      <teleport to="body">
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
      </teleport>
    </div>
    <app-paginate
      v-if="goods"
      :goods-length="allGoods.length"
      :size="PAGES_COUNT"
      v-model="page"
    />
  </section>
</template>

<script setup>
import {computed, onMounted, ref, watch} from "vue";
import {useStore} from "vuex";
import showCurrentCategory from "@/use/showCurrentCategory";
import AdminPopupGoods from "@/components/admin/AdminPopupGoods";
import AppPrompt from "@/components/app/AppPrompt";
import AppPaginate from "@/components/app/AppPaginate";
import chunk from "lodash.chunk";
import AppLoader from "@/components/app/AppLoader";
import {useRoute, useRouter} from "vue-router";
import axios from "axios";

const isLoading = ref(true);
const store = useStore();
const router = useRouter();
const route = useRoute();
const categories = ref([]);
const isShowPopup = ref(false);
const good = ref({});
const prompt = ref(false);
const page = ref(route.query.page ? +route.query.page : 1);

const createGood = () => {
  good.value = {};
  isShowPopup.value = true;
}

const changeGood = (event) => {
  good.value = store.getters['goods/goods'].find(item => item.id === event.target.getAttribute('data-id'));
  isShowPopup.value = true;
}

onMounted(async () => {
  await store.dispatch('goods/getAllGoods');
  await store.dispatch('categories/getCategories');
  categories.value = store.getters['categories/categories'];
  isLoading.value = false;
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

//paginate ============================================================================================================
const PAGES_COUNT = 6;
const allGoods = computed(() => store.getters['goods/goods']);
const changeRout = () => router.replace({query: {page: page.value}});
onMounted(changeRout);
watch(page, changeRout);

const goods = computed(() => chunk(allGoods.value, PAGES_COUNT)[page.value - 1])
</script>

<style lang="scss">
.goods {
  max-width: 800px;
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
      grid-template-columns: repeat(6, 1fr);
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
