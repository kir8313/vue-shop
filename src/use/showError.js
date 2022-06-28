import {inject, computed, watch} from "vue";
import alerts from "@/utils/alerts";
import {useStore} from "vuex";

export default function showError() {
  const $error = inject('$error');
  const store = useStore();

  const error = computed(() => {
    return store.getters.error;
  })

  watch(error, fbError => {
    $error(alerts[fbError.code] || `Неожиданная ошибка (${fbError.code})`)
  })

  return $error;
}
