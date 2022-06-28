import transform from "@/helpers/transform";
import baseAxios from "@/axios/db";

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
      s.categories = categories;
    },

    pushCategory(s, category) {
      s.categories.push(category);
    },

    putCategory(s, category) {
      const idx = s.categories.findIndex(item => item.id === category.id);
      s.categories[idx] = category;
    },

    deleteCategory(s, id) {
      s.categories = s.categories.filter(item => item.id !== id);
    },
  },

  actions: {
    async getCategories({commit}) {
      try {
        const {data} = await baseAxios.get("/categories.json");
        if (!data) {
          throw new Error("Ошибка. Нет категорий");
        }
        commit("changeCategories", transform(data));
      } catch (e) {
        commit("changeError", e, {root: true});
        throw e;
      }
    },

    async pushCategory({commit, getters}, category) {
      try {
        const {data} = await baseAxios.post("/categories.json", category);
        if (!data) {
          throw new Error("Ошибка с добавлением категории");
        }
        commit("pushCategory", {...category, id: data.name});
      } catch (e) {
        commit("changeError", e, {root: true});
        throw e;
      }
    },

    async putCategory({commit}, category) {
      try {
        const {data} = await baseAxios.put(`/categories/${category.id}.json`,
          Object.fromEntries(Object.entries(category).filter(item => item[0] !== "id")));
        if (!data) {
          throw new Error("Ошибка с изменением категории");
        }
        commit("putCategory", category);
      } catch (e) {
        commit("changeError", e, {root: true});
        throw e;
      }
    },

    async deleteCategory({commit}, id) {
      try {
        const {response} = await baseAxios.delete(`/categories/${id}.json`);
        if (response && response.status === 404) {
          throw new Error("Ошибка с удалением категории");
        }
        commit("deleteCategory", id);
      } catch (e) {
        commit("changeError", e, {root: true});
        throw e;
      }
    },
  }
}
