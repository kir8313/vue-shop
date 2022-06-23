export default {
  namespaced: true,
  state: {
    cart: JSON.parse(localStorage.getItem("cart")) ?? {},
  },
  getters: {
    cart: (s) => s.cart,
    cartLength: (s) => Object.keys(s.cart).length
  },
  mutations: {
    addGoodInCart(state, id) {
      state.cart = {...state.cart, [id]: 1};
      localStorage.setItem("cart", JSON.stringify(state.cart))
    },

    changeGoodCountInCart(state, {type, id}) {
      if (type === "increment") {
        state.cart[id]++;
      } else if (type === "decrement") {
        state.cart[id]--;
      }
      localStorage.setItem("cart", JSON.stringify(state.cart))
    },

    deleteGoodFromCart(state, id) {
      if (Object.keys(state.cart).length > 1) {
        state.cart = Object.fromEntries(Object.entries(state.cart).filter(good => good[0] !== id));
        localStorage.setItem("cart", JSON.stringify(state.cart));
      } else {
        state.cart = {};
        localStorage.removeItem("cart");
      }
    },

    clearCart (state) {
      state.cart = {};
      localStorage.removeItem("cart");
    },

    changeOrder(state, cartGoods) {
      state.order = cartGoods.map((good) => {
        const {title, price, id} = good;
        const count = Object.entries(state.cart).find(item => item[0] === id)[1]
        return {title, price, count};
      });
    },
  },
}
