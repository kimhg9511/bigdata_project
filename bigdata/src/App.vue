<template>
  <div id="app-container">
    <app-header></app-header>
    <router-view />
    <app-footer></app-footer>
  </div>
</template>
<script>
import AppHeader from './components/AppHeader.vue'
import AppFooter from './components/AppFooter.vue'
export default {
  components: {
    AppHeader,
    AppFooter
  }
}
</script>

<style scoped>
#app-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
</style>
