import axios from "axios";
import {firebaseUrl} from "@/utils/firebaseUrl";
import transform from "@/use/transform";

export default {
  namespaced: true,
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
      const idx = s.categories.findIndex(item => item.id === category.id);
      s.categories[idx] = category;
    },

    deleteCategory(s, id) {
      s.categories = s.categories.filter(item => item.id !== id);
      console.log('s.goods', s.categories)
    },
  },

  actions: {
    async getCategories({commit}) {
      try {
        const {data} = await axios.get(firebaseUrl + 'categories.json');
        if (!data) {
          throw new Error('Ошибка. Нет категорий')
        }
        commit('changeCategories', transform(data));
      } catch (e) {
        commit('changeError', e);
        throw e;
      }
    },

    async pushCategory({commit, getters}, category) {
      try {
        const {data} = await axios.post(`${firebaseUrl}categories.json`, category);
        console.log('data', data)
        if (!data) {
          console.log('da, error')
          throw new Error('Ошибка с добавлением категории')
        }
        commit('pushCategory', {...category, id: data.name});
        console.log('getters.categories', getters.categories)
      } catch (e) {
        commit('changeError', e);
        throw e;
      }
    },

    async putCategory({commit}, category) {
      try {
        const {data} = await axios.put(`${firebaseUrl}categories/${category.id}.json`,
          Object.fromEntries(Object.entries(category).filter(item => item[0] !== 'id')));
        if (!data) {
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
        const res = await axios.delete(`${firebaseUrl}categories/${id}.json`);
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
