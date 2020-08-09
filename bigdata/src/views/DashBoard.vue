<template>
  <div id="dashboard-wrap">
    <div class="row">
      <chart-slider class="chart-card col-12"></chart-slider>
    </div>
    <div class="row">
      <word-cloud class="chart-card col-6"></word-cloud>    
      <bar-chart class="chart-card col-6"></bar-chart>
    </div>
    <div class="row">
      <div class="chart-card col-4">member1 notebook here</div>
      <div class="chart-card col-4">member2 notebook here</div>
      <div class="chart-card col-4">member3 notebook here</div>
    </div>
    <div class="row">
      <div class="chart-card col-3">empty</div>
      <div class="chart-card col-3">empty</div>
      <div class="chart-card col-3">empty</div>
      <div class="chart-card col-3">empty</div>
    </div>
  </div>
</template>

<script>
import ChartSlider from "../components/ChartSlider"
import BarChart from "../components/BarChart";
import WordCloud from "../components/WordCloud";

export default {
  components: {
    ChartSlider,
    BarChart,
    WordCloud
  }
}
</script>

<style scoped>
#dashboard-wrap{
  background-color: #e5e5e5;
}
.row {
  width: 100%;
  display: flex;
  flex-flow: row wrap;
}
.chart-card{
  flex: 0 1 auto;
  background-color: #fff;
  margin: 0.33%;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2),0 6px 20px 0 rgba(0, 0, 0, 0.19);
}
.col-12 {
  width: 99.33%;
}
.col-6 {
  width: 49.33%;
}
.col-4 {
  width: 32.67%;
}
.col-3 {
  width: 24.33%;
}
</style>