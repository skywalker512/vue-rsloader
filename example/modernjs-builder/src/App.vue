<script setup lang="ts">
import HelloWorld from './components/HelloWorld.vue'
import VueSvg from './assets/vue.svg'
</script>

<template>
  <div>
    <a href="https://rspack.dev" target="_blank">
      <img
        src="./assets/rspack.png"
        class="logo h-[6em] p-[1.5em]"
        alt="Vite logo"
      />
    </a>
    <a href="https://vuejs.org/" target="_blank">
      <VueSvg class="logo vue h-[6em] p-[1.5em]" alt="Vue logo" />
    </a>
  </div>
  <HelloWorld msg="Rspack + Vue" />
</template>

<style scoped lang="scss">
.logo {
  will-change: filter;
  transition: filter 300ms;
  &:hover {
    filter: drop-shadow(0 0 2em #f5bfa1aa);
  }
  &.vue:hover {
    filter: drop-shadow(0 0 2em #42b883aa);
  }
}
</style>
