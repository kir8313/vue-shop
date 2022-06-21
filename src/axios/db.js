import axios from 'axios'
import store from '../store'
import router from '../router'

const baseAxios = axios.create({
  baseURL: process.env.VUE_APP_FB_URL
})

baseAxios.defaults.params = {}

baseAxios.interceptors.request.use(async config => {
  if (!store.getters['auth/isAuthenticated']) {
    return config
  }

  if (store.getters['auth/isExpired']) {
    await store.dispatch('auth/refresh')
  }

  config.params['auth'] = store.getters['auth/token']

  return config
})

baseAxios.interceptors.response.use(null, async (error) => {
  if (error.response.status === 401) {
    await store.dispatch('auth/logout')
    await router.push('/auth?message=auth')
  }

  return Promise.reject(error)
})

export default baseAxios
