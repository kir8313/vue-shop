import transform from "@/helpers/transform";
import baseAxios from "@/axios/db";

export default {
  namespaced: true,
  state: {
    goods: null,
    selectedGoods: null,
  },

  getters: {
    goods: (s) => s.goods,
    selectedGoods: (s) => s.selectedGoods,
  },
  mutations: {
    changeGoods: (s, goods) => {
      s.goods = transform(goods).sort((a) => {
        if (a.count === 0) {
          return 1;
        }
        return -1;
      })
    },

    pushGood(s, good) {
      s.goods.push(good)
    },

    putGood(s, good) {
      const idx = s.goods.findIndex(item => item.id === good.id);
      s.goods[idx] = good;
    },
    updateGoodCount(state, {id, count}) {
      const goods = state.goods.find(g => g.id === id)
      goods.count = count
    },

    deleteGood(s, id) {
      s.goods = s.goods.filter(good => good.id !== id);
    },

    changeSelectedGoods(s, goods) {
      s.selectedGoods = goods;
    },

    deleteSelectedGoods(s, id) {
      s.selectedGoods = s.selectedGoods.filter(good => good.id !== id);
    }
  },
  actions: {
    async getAllGoods({commit}) {
      try {
        const {data} = await baseAxios.get("/products.json");
        if (!data) {
          throw new Error("Ошибка. Нет пользователей")
        }
        commit("changeGoods", data)
      } catch (e) {
        commit("changeError", e, {root: true});
        throw e;
      }
    },

    async getGood({commit}, id) {
      try {
        const {data} = await baseAxios.get(`/products/${id}.json`);
        if (!data) {
          throw new Error("Ошибка с получением товара")
        }
        return {...data, id};
      } catch (e) {
        commit("changeError", e, {root: true});
        throw e;
      }
    },

    async getFilterGoods({commit, getters}, urls) {
      if (!getters.goods) {
        try {
          const {data} = await baseAxios.get(`/products.json`);
          if (!data) {
            throw new Error("Ошибка с фильтром товаров")
          }
          commit("changeGoods", data)
          commit("changeSelectedGoods", filterGoods(urls, transform(data)));
        } catch (e) {
          commit("changeError", e, {root: true});
          throw e;
        }
      } else {
        commit("changeSelectedGoods", filterGoods(urls, getters.goods));
      }

      function filterGoods(urlKeys, goods) {
        if (Object.keys(urlKeys).length > 1) {
          return Object.keys(urlKeys).reduce((accum, key) => {
            const good = goods.find(good => good.id === key);
            if (good) {
              return [...accum, good];
            }
          }, [])
        } else {
          const findGood = goods.find(good => good.id === Object.keys(urlKeys)[0]);
          return findGood ? [findGood] : [];
        }
      }

    },

    async pushGood({commit}, good) {
      try {
        const {data} = await baseAxios.post("/products.json", good);
        if (!data) {
          throw new Error("Ошибка с добавлением товара");
        }
        commit("pushGood", {...good, id: data.name});
      } catch (e) {
        commit("changeError", e, {root: true});
        throw e;
      }
    },

    async putGood({commit}, good) {
      try {
        const {data} = await baseAxios.put(`/products/${good.id}.json`,
          Object.fromEntries(Object.entries(good).filter(item => item[0] !== 'id')));
        if (!data) {
          throw new Error('Ошибка с изменением товара');
        }
        commit('putGood', good);
      } catch (e) {
        commit('changeError', e, {root: true});
        throw e;
      }
    },

    async deleteGood({commit}, id) {
      try {
        await baseAxios.delete(`/products/${id}.json`);
        commit('deleteGood', id);
      } catch (e) {
        commit('changeError', e, {root: true});
        throw e;
      }
    },
  }
}
