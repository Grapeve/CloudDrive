import { ref } from 'vue'
import { defineStore } from 'pinia'

interface breadcrumb {
  id: string
  name: string
}

export const useBreadcrumbStore = defineStore('breadcrumb', () => {
  const breadCrumbs = ref<breadcrumb[]>([])

  function addBreadcrumb(breadCrumb: breadcrumb) {
    breadCrumbs.value.push(breadCrumb)
  }

  function clearBreadcrumb() {
    breadCrumbs.value = new Array()
  }

  return { breadCrumbs, addBreadcrumb, clearBreadcrumb }
})
