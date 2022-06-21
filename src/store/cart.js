import baseAxios from "@/axios/db";

export default {
  namespaced: true,
  state: {
    cart: JSON.parse(localStorage.getItem('cart')) ? JSON.parse(localStorage.getItem('cart')) : null,
    order: null,
  },
  getters: {
    cart: (s) => s.cart,
    order: (s) => s.order,
  },
  mutations: {
    addGoodInCart(state, id) {
      state.cart = {...state.cart, [id]: 1};
      localStorage.setItem('cart', JSON.stringify(state.cart))
    },

    changeGoodCountInCart(state, {type, id}) {
      if (type === 'increment') {
        state.cart[id]++;
      } else if (type === 'decrement') {
        state.cart[id]--;
      }
      localStorage.setItem('cart', JSON.stringify(state.cart))
    },

    deleteGoodFromCart(state, id) {
      if (Object.keys(state.cart).length > 1) {
        state.cart = Object.fromEntries(Object.entries(state.cart).filter(good => good[0] !== id));
        localStorage.setItem('cart', JSON.stringify(state.cart))
      } else {
        state.cart = null;
        localStorage.removeItem('cart')
      }
    },

    clearCartAndOrder (state) {
      state.cart = state.order = null;
      localStorage.removeItem('cart');
    },

    changeOrder(state, cartGoods) {
      state.order = cartGoods.map((good) => {
        const {title, price, id} = good;
        const count = Object.entries(state.cart).find(item => item[0] === id)[1]
        return {title, price, count};
      });
    },
  },

  actions: {
    async pushOrder({commit}, order) {
      try {
        const {data} = await baseAxios.post('/orders.json', order);
        if (!data) {
          throw new Error('Ошибка с добавлением заказа!')
        }
        commit('clearCartAndOrder');
      } catch (e) {
        commit('changeError', e, {root: true});
        throw e;
      }
    }
  },
}
