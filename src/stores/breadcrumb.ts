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

  function deleteBreadcrumb(id: string) {
    const index = breadCrumbs.value.findIndex((breadCrumb) => breadCrumb?.id === id)
    if (index !== -1) {
      breadCrumbs.value.reverse().splice(0, index + 1)
    }
  }

  function clearBreadcrumb() {
    breadCrumbs.value = new Array()
  }

  return { breadCrumbs, addBreadcrumb, deleteBreadcrumb, clearBreadcrumb }
})
