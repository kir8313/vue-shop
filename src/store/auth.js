import {authFirebase, logout} from "@/utils/firebase.config";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import {firebaseUrl} from "@/utils/firebaseUrl";
import axios from "axios";

export default {
  state: {
    user: null,
  },
  getters: {
    user(state) {
      return state.user
    },
  },
  mutations: {
    updateUser(state, user) {
      state.user = user;
    },

    updateName(state, name) {
      state.user.name = name;
    },

    clearSession(state) {
      state.user = {};
      localStorage.clear()
    }
  },
  actions: {
    async login({dispatch, commit}, {email, password}) {
      try {
        const signUser = await signInWithEmailAndPassword(authFirebase, email, password);
        localStorage.setItem('token', signUser.user.uid)
      } catch (e) {
        commit('changeError', e)
        throw e
      }
    },

    async logout({commit}) {
      await logout;
      commit('clearSession');
    },

    async register({dispatch, commit}, {email, password, name}) {
      try {
        await createUserWithEmailAndPassword(authFirebase, email, password);
        const uid = await dispatch('getUid');

        await axios.put(`${firebaseUrl}users/${uid}.json`, { email, name, role: 'admin' })

        localStorage.setItem('token', uid)
      } catch (e) {
        commit('changeError', e);
        throw e;
      }
    },

    async getUser({dispatch, commit}) {
      const uid = await dispatch('getUid');
      const res = await fetch(`${firebaseUrl}users/${uid}.json`);
      const result = await res.json();
      await commit('updateUser', result);
    },

    async changeName({dispatch, commit, getters}, userName) {
      const uid = await dispatch('getUid');
      await fetch(`${firebaseUrl}users/${uid}.json`, {
        method: 'PUT',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...getters.user, name: userName
        })
      });
      commit('updateName', userName)
    }
  }
}

