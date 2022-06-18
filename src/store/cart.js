export default {
  namespaced: true,
  state: {
    cart: JSON.parse(localStorage.getItem('cart'))? JSON.parse(localStorage.getItem('cart')) : null,
  },
  getters: {
    cart: (s) => s.cart,
  },
  mutations: {
    addGoodInCart(state, id) {
      state.cart = {...state.cart, [id]: 1};
      localStorage.setItem('cart', JSON.stringify(state.cart))
    },
    ChangeGoodCountInCart(state, {type, id}) {
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
  },
}
