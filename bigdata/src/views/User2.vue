<template>
  <div>
    <div id="monthly-profits">
      <line-chart-profit></line-chart-profit>
      <bar-chart-profit></bar-chart-profit>
    </div>
  </div>
</template>

<script>
import BarChartProfit from "../components/BarChartProfit"
import LineChartProfit from "../components/LineChartProfit"
export default {
  components: {
    BarChartProfit,
    LineChartProfit,
  },

}
</script>

<style scoped>
#bar-chart-profit {
  padding-top: 60%;
}
#line-chart-profit {
  padding-top: 60%;
}  
@media screen and (min-width: 1025px){
#monthly-profits {
  display: flex;
}
#bar-chart-profit {
  width: 50%;
  padding-top: 30%;
}
#line-chart-profit {
  width: 50%;
  padding-top: 30%;
}  
}
</style>