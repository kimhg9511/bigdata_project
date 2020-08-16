<template>
  <div id="wrap">
    <line-chart-upgrade></line-chart-upgrade>
    <bar-chart-upgrade></bar-chart-upgrade>
  </div>
</template>

<script>
import BarChartUpgrade from "../components/BarChartUpgrade";
import LineChartUpgrade from "../components/LineChartUpgrade";
export default {
  components: {
    BarChartUpgrade,
    LineChartUpgrade, 
  }
}
</script>

<style scoped>
#wrap>div{
  padding-top: 60%;
}
@media screen and (min-width: 1025px){
#wrap {
  display: flex;
}
#wrap > div {
  width: 50%;
  padding-top: 30%;
}  
}
</style>