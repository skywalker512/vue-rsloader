<script setup lang="ts">
import { ref } from 'vue'
import { MDXProvider } from '@mdx-js/vue'
import Post from './readme.md'

defineProps<{ msg: string }>()

const count = ref(0)
</script>

<template>
  <h1>{{ msg }}</h1>

  <div class="card">
    <button type="button" @click="count++">count is {{ count }}</button>
    <p>
      Edit
      <code>components/HelloWorld.vue</code> to test HMR
    </p>
  </div>

  <a href="https://github.com/skywalker512/vue-rsloader" target="_blank">
    Vue Rspack Loader Github
  </a>
  <div class="text-left">
    <MDXProvider>
      <Post />
    </MDXProvider>
  </div>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
