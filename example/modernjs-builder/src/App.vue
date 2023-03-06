<script setup lang="ts">
import HelloWorld from './components/HelloWorld.vue'
import VueSvg from './assets/vue.svg'
</script>

<template>
  <div>
    <a href="https://rspack.dev" target="_blank">
      <img src="./assets/rspack.png" class="logo" alt="Vite logo" />
    </a>
    <a href="https://vuejs.org/" target="_blank">
      <VueSvg class="logo vue" alt="Vue logo" />
    </a>
  </div>
  <HelloWorld msg="Rspack + Vue" />
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #f5bfa1aa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
