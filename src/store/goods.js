import axios from "axios";
import {firebaseUrl} from "@/utils/firebaseUrl";
import transform from "@/use/transform";

export default {
  namespaced: true,
  state: {
    goods: null,
  },

  getters: {
    goods: (s) => s.goods,
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

    deleteGood(s, id) {
      s.goods = s.goods.filter(good => good.id !== id);
      console.log('s.goods', s.goods)
    },
  },
  actions: {
    async getAllGoods({commit}) {
      try {
        const {data} = await axios.get(firebaseUrl + 'products.json');
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
        const {data} = await axios.get(`${firebaseUrl}products/${id}.json`);
        if (!data) {
          throw new Error('Ошибка с фильтром товаров')
        }
        return {...data, id};
      } catch (e) {
        commit('changeError', e);
        throw e;
      }
    },

    async getFilterGoods({commit, getters}, urls) {
      if (!getters.goods) {
        try {
          const {data} = await axios.get(`${firebaseUrl}products.json`);
          if (!data) {
            throw new Error('Ошибка с фильтром товаров')
          }
          const goods = Object.keys(data).map(key => ({...data[key], id: key}))
          return filterGoods(urls, goods);
        } catch (e) {
          commit('changeError', e);
          throw e;
        }
      } else {
        return filterGoods(urls, getters.goods);
      }

      function filterGoods(urlKeys, goods) {
        if (Object.keys(urlKeys).length > 1) {
          return Object.keys(urlKeys).reduce((accum, key) => {
            const good = goods.find(good => good.id === key);
            if (good) {
              return [...accum, good]
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
        const {data} = await axios.post(`${firebaseUrl}products.json`, good);
        if (!data) {
          console.log('da, error')
          throw new Error('Ошибка с добавлением товара')
        }
        console.log('data', data)
        commit('pushGood', {...good, id: data.name});
      } catch (e) {
        commit('changeError', e);
        throw e;
      }
    },

    async putGood({commit}, good) {
      try {
        const id = good.id;
        delete good.id;
        const {data} = await axios.put(`${firebaseUrl}products/${id}.json`, good);
        if (!data) {
          throw new Error('Ошибка с изменением товара')
        }
        commit('putGood', {...good, id});
      } catch (e) {
        commit('changeError', e);
        throw e;
      }
    },

    async deleteGood({commit}, id) {
      try {
        const response = await axios.delete(`${firebaseUrl}products/${id}.json`);
        console.log('response', response)
        commit('deleteGood', id);
      } catch (e) {
        commit('changeError', e);
        throw e;
      }
    },
  }
}
