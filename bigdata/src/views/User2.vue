<template>
  <div id="monthly-profits">
    <bar-chart-profit></bar-chart-profit>
    <line-chart-profit></line-chart-profit>
  </div>
</template>

<script>
import BarChartProfit from "../components/BarChartProfit"
import LineChartProfit from "../components/LineChartProfit"
export default {
  components: {
    BarChartProfit,
    LineChartProfit,
  }
}
</script>

<style scoped>
#monthly-profits {
  display: flex;
}
#bar-chart-profit {
  width: 50%;
}
</style>