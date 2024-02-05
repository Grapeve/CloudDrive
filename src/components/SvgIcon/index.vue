<script setup lang="ts">
import { computed } from 'vue'
const props = defineProps({
  // icon图标
  icon: {
    type: String,
    required: true,
    default: 'burst'
  },
  // 图标类名
  className: {
    type: String,
    default: ''
  },
  color: {
    type: String,
    default: '#333'
  }
})
/**
 * 内部图标
 */
const iconName = computed(() => `#icon-${props.icon}`)
</script>

<template>
  <svg class="svg-icon" :class="className" aria-hidden="true">
    <use :href="iconName" :fill="color"></use>
  </svg>
</template>

<style scoped lang="less">
.svg-icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.36em;
  fill: currentColor;
  overflow: hidden;
}
</style>
