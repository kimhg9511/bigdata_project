<template>
  <div id="dashboard-wrap">
    <div class="group">
      <div class="row">
        <chart-slider class="chart-card col-12"></chart-slider>
        <div class="row">
          <word-cloud class="chart-card col-6"></word-cloud>    
          <bar-chart-profit class="chart-card col-6" :month="'Jan-19'"></bar-chart-profit>
        </div>
      </div>
      <div class="row">
        <bar-chart-marcap class="chart-card col-12"></bar-chart-marcap>
      </div>
    </div>
    <div class="row notebook">
      <div class="chart-card col-4">member1 notebook</div>
      <div class="chart-card col-4">member2 notebook</div>   
      <div class="chart-card col-4">member3 notebook</div>
    </div>
    <div class="row information">
      <div class="chart-card col-3">현재시각<br>00-00-00 00:00:00</div>
      <div class="chart-card col-3">차트시각<br>00-00-00 00:00:00</div>
      <div class="chart-card col-3">empty</div>
      <div class="chart-card col-3">empty</div>
    </div>
  </div>
</template>

<script>
import ChartSlider from "../components/ChartSlider"
import BarChartProfit from "../components/BarChartProfit";
import WordCloud from "../components/WordCloud";
import BarChartMarcap from "../components/BarChartMarcap"
export default {
  components: {
    ChartSlider,
    BarChartProfit,
    BarChartMarcap,
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
.chart-card {
  background-color: #fff;
  margin: 0.5%;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2),0 6px 20px 0 rgba(0, 0, 0, 0.19);
}
.notebook {
  height: 30%;
}
.notebook>div{
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  font-size: 2rem;
}
.information {
  height: 23%;
}
.information>div{
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  font-size: 1.5rem;
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