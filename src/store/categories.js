import axios from "axios";
import dbUrl from "@/utils/dbUrl";

export default {
  state: {
    categories: null,
  },

  getters: {
    categories: (s) => s.categories,
  },

  mutations: {
    changeCategories(s, categories) {
      s.categories = categories
    },

    pushCategory(s, category) {
      s.categories.push(category)
    },

    putCategory(s, category) {
      const idx = s.categories.findIndex(item => +item.id === +category.id);
      s.categories[idx] = category;
    },

    deleteCategory(s, id) {
      s.categories = s.categories.filter(item => +item.id !== +id);
      console.log('s.goods', s.categories)
    },
  },

  actions: {
    async getCategories({commit}) {
      try {
        const {data} = await axios.get(dbUrl + 'categories');
        if (!data) {
          throw new Error('Ошибка. Нет категорий')
        }
        commit('changeCategories', data);
      } catch (e) {
        commit('changeError', e);
        throw e;
      }
    },
    async pushCategory({commit}, category) {
      try {
        const {data} = await axios.post(`${dbUrl}categories/`, category);
        console.log('response', await data)
        if (!data) {
          console.log('da, error')
          throw new Error('Ошибка с добавлением категории')
        }
        commit('pushCategory', category);
      } catch (e) {
        commit('changeError', e);
        throw e;
      }
    },

    async putCategory({commit}, category) {
      try {
        const {data} = await axios.put(`${dbUrl}categories/${category.id}`, category);
        console.log('response', await data)
        if (!data) {
          console.log('da, error')
          throw new Error('Ошибка с изменением категории')
        }
        commit('putCategory', category);
      } catch (e) {
        commit('changeError', e);
        throw e;
      }
    },

    async deleteCategory({commit}, id) {
      try {
        const res = await axios.delete(`${dbUrl}categories/${id}`);
        console.log('response', res)
        if (res.response && res.response.status === 404) {
          throw new Error('Ошибка с удалением категории')
        }
        commit('deleteCategory', id);
      } catch (e) {
        commit('changeError', e);
        throw e;
      }
    },
  }
}
