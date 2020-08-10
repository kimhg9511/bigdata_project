<template>
  <div id="user2">
    <bar-chart-profit></bar-chart-profit>
  </div>
</template>

<script>
import BarChartProfit from "../components/BarChartProfit"

export default {
  components: {
    BarChartProfit
  }
}
</script>

<style scoped>
#bar-chart-profit {
  height: 100%;
}
</style>