import {authFirebase, logout} from "@/utils/firebase.config";
import {signInWithEmailAndPassword, createUserWithEmailAndPassword} from 'firebase/auth';
import {firebaseUrl} from "@/utils/firebaseUrl";
import axios from "axios";

export default {
  namespaced: true,
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

    clearSession(state) {
      state.user = null;
      localStorage.removeItem('token');
    }
  },
  actions: {
    async login({dispatch, commit}, {email, password}) {
      try {
        const signUser = await signInWithEmailAndPassword(authFirebase, email, password);
        localStorage.setItem('token', signUser.user.uid);
        dispatch('getUser')
      } catch (e) {
        commit('changeError', e, {root: true})
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
        const uid = await dispatch('getUid', null, {root: true});

        await axios.put(`${firebaseUrl}users/${uid}.json`, {email, name, role: 'user'})

        localStorage.setItem('token', uid);
        dispatch('getUser');
      } catch (e) {
        commit('changeError', e, {root: true});
        throw e;
      }
    },

    async getUser({dispatch, commit}) {
      try {
        const uid = await dispatch('getUid', null, {root: true});
        const {data} = await axios.get(`${firebaseUrl}users/${uid}.json`);
        if (data) {
          await commit('updateUser', {...data, id: uid})
        } else {
          console.log('Пользователь не найден')
        }
      } catch (e) {
        commit('changeError', e, {root: true});
        throw e;
      }
    }
  }
}

