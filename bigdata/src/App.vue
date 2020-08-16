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
  created() {
    this.$store.dispatch("LOAD_JSON_CLOUD", "word.json")
    this.$store.dispatch("LOAD_JSON_BAR_MARCAP", "marcap08052.json")
    this.$store.dispatch("LOAD_CSV_LINE_PROFIT", "profit4.csv")
    this.$store.dispatch("LOAD_CSV_LINE_PROFIT_UPGRADE", "list_2.csv")
    this.$store.dispatch("LOAD_CSV_BAR_PROFIT", "each.csv")
    this.$store.dispatch("LOAD_CSV_BAR_PROFIT_UPGRADE", "rank_1.csv")
  }
}
</script>

<style>
#app-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
  font-family: "NanumSquareRound";
}
.svg-container {
  position: relative;
  width: 100%;
  vertical-align: top;
  overflow: hidden;
}
.svg-container:before {
  content: "";
  display: block;
}
.svg-content {
  background-color: #333; 
  position: absolute;
  top: 0;
  left: 0;
}
.svg-content .domain,
.svg-content .tick {
  font-size: 1.2rem;
  font-family: "NanumBarunpen";
  font-weight: 700;
  color: #e5e5e5;
}
</style>