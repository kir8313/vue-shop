import { createStore } from 'vuex'
import auth from "./auth";
import goods from "./goods";
import cart from "./cart";
import categories from "./categories";
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
    auth, goods, cart, categories
  }
})
