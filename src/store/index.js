import { createStore } from 'vuex'
import auth from "./modules/auth";
import goods from "./modules/goods";
import cart from "./modules/cart";
import categories from "./modules/categories";
import order from "./modules/order";
import {authFirebase} from "@/utils/firebase.config";

export default createStore({
  state: {
    error: null,
  },
  getters: {
    error: (s) => s.error,
  },
  mutations: {
    changeError(state, error) {
      state.error = error;
    },
    resetError(state) {
      state.error = null;
    },
  },
  actions: {
    async getUid() {
      const user = authFirebase.currentUser
      return user ? user.uid : localStorage.getItem('token') ? localStorage.getItem('token') :  null;
    },
  },
  modules: {
    auth, goods, cart, categories, order
  }
})
