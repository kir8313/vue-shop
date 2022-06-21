import {authFirebase, logout} from "@/utils/firebase.config";
import {signInWithEmailAndPassword, createUserWithEmailAndPassword} from 'firebase/auth';
import baseAxios from "@/axios/db";

const TOKEN_KEY = 'jwt-token';
const REFRESH_KEY = 'jwt-refresh-token';
const EXPIRES_KEY = 'jwt-expires';
const USER_KEY = 'shop-user';

export default {
  namespaced: true,
  state: {
    user: JSON.parse(localStorage.getItem(USER_KEY)) ?? {},
    token: localStorage.getItem(TOKEN_KEY),
    refreshToken: localStorage.getItem(REFRESH_KEY),
    expiresDate: new Date(localStorage.getItem(EXPIRES_KEY)),
  },
  getters: {
    user(state) {
      return state.user;
    },
    isAdmin(state) {
      return state.user.role === 'admin';
    },
    token(state) {
      return state.token;
    },
    isAuthenticated(_, getters) {
      return !!getters.token && !getters.isExpired;
    },
    isUser(_, getters) {
      return !getters.isAdmin;
    },
    isExpired(state) {
      return new Date() >= state.expiresDate;
    },
  },
  mutations: {
    updateUser(state, user) {
      state.user = user;
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    },

    clearSession(state) {
      state.user = {};
      state.token = null;
      state.refreshToken = null;
      state.expiresDate = null;
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(REFRESH_KEY);
      localStorage.removeItem(EXPIRES_KEY);
      localStorage.removeItem(USER_KEY);
    },
    changeToken(state, {refreshToken, idToken, expiresIn = '3600'}) {
      const expiresDate = new Date(new Date().getTime() + Number(expiresIn) * 1000);
      state.token = idToken;
      state.refreshToken = refreshToken;
      state.expiresDate = expiresDate;
      localStorage.setItem(TOKEN_KEY, idToken);
      localStorage.setItem(REFRESH_KEY, refreshToken);
      localStorage.setItem(EXPIRES_KEY, expiresDate.toString());
    },
  },
  actions: {
    async login({dispatch, commit}, {email, password}) {
      try {
        const {_tokenResponse} = await signInWithEmailAndPassword(authFirebase, email, password);
        dispatch('getUser', _tokenResponse.localId);
        commit('changeToken', _tokenResponse);
      } catch (e) {
        commit('changeError', e, {root: true});
        throw e;
      }
    },

    async register({dispatch, commit}, {email, password, name}) {
      try {
        const {_tokenResponse} = await createUserWithEmailAndPassword(authFirebase, email, password);
        commit('changeToken', _tokenResponse);
        await dispatch('createUser', {..._tokenResponse, name});
      } catch (e) {
        commit('changeError', e, {root: true});
        throw e;
      }
    },

    async logout({commit}) {
      await logout;
      commit('clearSession');
    },

    async createUser({commit}, payload) {
      try {
        await baseAxios.put(`/users/${payload.localId}.json`, {
          name: payload.name,
          role: 'user',
          email: payload.email
        });
        commit('updateUser', {name: payload.name, role: 'user', email: payload.email , id: payload.localId});
      } catch (e) {
        commit('changeError', e, {root: true});
        throw e;
      }
    },

    async getUser({dispatch, commit}, userId) {
      try {
        const {data} = await baseAxios.get(`/users/${userId}.json`);
        if (data) {
          await commit('updateUser', {...data, id: userId});
        } else {
          throw new Error('Пользователь не найден');
        }
      } catch (e) {
        commit('changeError', e, {root: true});
        throw e;
      }
    }
  }
}

