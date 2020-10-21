<template>
  <div id="dashboard-wrap">
    <div class="group">
      <div class="row">
        <chart-slider class="chart-card col-12"></chart-slider>
        <div class="row">
          <line-chart-profit class="chart-card col-6"></line-chart-profit>
          <bar-chart-profit class="chart-card col-6"></bar-chart-profit>
        </div>
      </div>
      <div class="row">
          <word-cloud class="chart-card col-12"></word-cloud> 
      </div>
    </div>
    <div class="row notebook">
      <div class="chart-card col-4"><a href="/bigdata_project/data/marcap.html">신동환 notebook</a></div>
      <div class="chart-card col-4"><a href="/bigdata_project/data/ex3.html">이수연 notebook</a></div>   
      <div class="chart-card col-4"><a href="/bigdata_project/data/team_project.html?ver=1.1">심은식 notebook</a></div>
    </div>
  </div>
</template>

<script>
import ChartSlider from "../components/ChartSlider";
import BarChartProfit from "../components/BarChartProfit";
import WordCloud from "../components/WordCloud";
import LineChartProfit from "../components/LineChartProfit";
export default {
  components: {
    ChartSlider,
    BarChartProfit,
    LineChartProfit,
    WordCloud
  },
}
</script>

<style scoped>
.chart-card {
  color: #e5e5e5;
  background-color: #333; 
  margin: 0.5%;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2) ,0 6px 20px 0 rgba(0, 0, 0, 0.19);
}
.notebook {
  height: 30%;
}
.notebook>div{
  display: flex;
  height: 150px;
  justify-content: center;
  align-items: center;
  text-align: center;
  font-size: 2rem;
}
.notebook>div>a {
  color: #e5e5e5;
}
.information>div{
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  font-size: 1.5rem;
}
.row {
  width: 100%;
  display: flex;
  flex-flow: row wrap;
  align-items: center;
}
.col-12 {
  width: 99%;
}
.col-6 {
  width: 49%;
}
.col-4 {
  width: 32.33%;
}
.col-3 {
  width: 24%;
}
@media screen and (min-width: 1025px) {
  .group {
    display: flex;
  }
}
</style>