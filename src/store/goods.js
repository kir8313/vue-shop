import axios from "axios";
import dbUrl from "@/utils/dbUrl";

export default {
  state: {
    goods: null,
  },

  getters: {
    goods: (s) => s.goods,
  },
  mutations: {
    changeGoods: (s, goods) => {
      s.goods = goods.sort((a) => {
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
      const idx = s.goods.findIndex(item => +item.id === +good.id);
      s.goods[idx] = good;
    },

    deleteGood(s, id) {
      s.goods = s.goods.filter(good => +good.id !== +id);
      console.log('s.goods', s.goods)
    },
  },
  actions: {
    async getAllGoods({commit}) {
      try {
        const {data} = await axios.get(dbUrl + 'products');
        if (!data) {
          throw new Error('Ошибка. Нет пользователей')
        }
        commit('changeGoods', data)
      } catch (e) {
        commit('changeError', e);
        throw e;
      }
    },

    async getGood({commit}, id) {
      try {
        const {data} = await axios.get(`${dbUrl}products?id=${id}`);
        if (!data) {
          throw new Error('Ошибка с фильтром товаров')
        }
        return data;
      } catch (e) {
        commit('changeError', e);
        throw e;
      }
    },

    async getFilterGoods({commit}, url) {
      const filter = Object.keys(url).map(key => 'id=' + key).join('&')
      try {
        const {data} = await axios.get(`${dbUrl}products?${filter}`);
        if (!data) {
          throw new Error('Ошибка с фильтром товаров')
        }
        return data;
      } catch (e) {
        commit('changeError', e);
        throw e;
      }
    },

    async pushGood({commit}, good) {
      try {
        const {data} = await axios.post(`${dbUrl}products/`, good);
        console.log('response', await data)
        if (!data) {
          console.log('da, error')
          throw new Error('Ошибка с добавлением товара')
        }
        commit('pushGood', good);
      } catch (e) {
        commit('changeError', e);
        throw e;
      }
    },

    async putGood({commit}, good) {
      try {
        const {data} = await axios.put(`${dbUrl}products/${good.id}`, good);
        if (!data) {
          throw new Error('Ошибка с изменением товара')
        }
        commit('putGood', good);
      } catch (e) {
        commit('changeError', e);
        throw e;
      }
    },

    async deleteGood({commit}, id) {
      try {
        const response = await axios.delete(`${dbUrl}products/${id}`);
        console.log('response', response)
        commit('deleteGood', id);
      } catch (e) {
        commit('changeError', e);
        throw e;
      }
    },
  }
}
