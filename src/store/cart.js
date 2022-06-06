export default {
  namespaced: true,
  state: {
    cart: {},
  },
  getters: {
    cart: (s) => s.cart,
  },
  mutations: {
    addGoodInCart(state, id) {
      state.cart = {...state.cart, [id]: 1};
    },
    ChangeGoodCountInCart(state, {type, id}) {
        if (type === 'increment') {
          state.cart[id]++;
        } else if (type === 'decrement') {
          state.cart[id]--;
        }
    },

    deleteGoodFromCart(state, id) {
      state.cart = Object.fromEntries(Object.entries(state.cart).filter(good => +good[0] !== +id))
    },
  },
}
