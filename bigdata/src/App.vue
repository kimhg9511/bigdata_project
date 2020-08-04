<template>
  <div id="app-container">
    <app-header></app-header>
    <app-main></app-main>
    <app-footer></app-footer>
  </div>
</template>
<script>
import AppHeader from './components/AppHeader.vue'
import AppMain from './components/AppMain.vue'
import AppFooter from './components/AppFooter.vue'
export default {
  components: {
    AppHeader,
    AppMain,
    AppFooter
  },
}
</script>

<style scoped>
#app-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow-x: hidden;
}
</style>
