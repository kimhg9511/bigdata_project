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
  // data() {
  //   return {
  //     month: ""
  //   }
  // },
  components: {
    BarChartProfit,
    LineChartProfit,
  },
  // methods: {
  //   changeMonth(newMonth) {
  //     this.month = newMonth;
  //   }
  // }
}
</script>

<style scoped>
#monthly-profits {
  display: flex;
}
#bar-chart-profit {
  width: 50%;
}
#line-chart-profit {
  width: 50%;
}
</style>