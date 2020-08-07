<template>
  <div class="user1">
    <div id="progress-bar"></div>
    <button id="play-button">Play</button>
    <div id="bar-chart"></div>
  </div>
</template>

<script>
import * as d3 from "d3";
import { drawSVG, drawSlider, drawCirclePlot, setAxis, preProcess } from "../assets/drawChart.js";
import json from "../../public/data/marcap08052.json"
export default {
  mounted() {
    this.drawChart();
  },
  methods: {
    drawChart() {
/**
 * slider part
 */
      const svgWidth = 960;
      const svgHeight = 100;
      const margin = {top:40, right:50, bottom:15, left:50}
      const graphWidth = svgWidth - margin.left - margin.right;
      const graphHeight = svgHeight - margin.top - margin.bottom;
      /** 무슨값? 
       *  moving        : slider 버튼을 클릭했을때 자동으로 움직일지 bool값
       *  currentValue  : 현재 progress bar의 위치(초기값: 시작위치)
       *  targetValue   : 목표 progress bar의 위치(초기값: 그래프 끝위치)
       * */ 
      // let moving = false;
      let currentValue = 0;
      let targetValue = graphWidth;
      /** 무슨값?
       * dataset : csv파일을 불러와서 담을 변수
       * timer : setInterval(이벤트 실행 간격)을 저장하는 변수
       */
      let dataset;
      let timer;
      // 날짜 포맷 설정
      const formatD3ToMonth = d3.timeFormat("%b %Y");
      const formatD3ToDate = d3.timeFormat("%d %b");
      const parseDateToD3 = d3.timeParse("%y-%m-%d");
      const formatD3ToTime = d3.timeFormat("%Y-%m-%d 00:00:00")
      // 시작일, 종료일 설정
      const startDate = new Date("2019-01-01 00:00:00");
      const endDate = new Date("2019-12-31 00:00:00");
      // svg 생성
      const svgProgress = d3.select("#progress-bar");
      // playButton 지정
      const playButton = d3.select("#play-button");
      // svg 생성
      const progressBar = drawSVG(svgProgress, svgWidth, svgHeight, margin);
      // xScale값 지정(slider)
      const xScale = d3.scaleTime()
        .domain([startDate, endDate])
        .range([0, targetValue])
        .clamp(true);
      // slider 그리기
      const drawBarChart = this.drawBarChart;
      const slider = drawSlider(progressBar, xScale)

      let handle = slider.insert("circle", ".track-overlay")
      .attr("class", "handle")
      .attr("r", 9)
      let label = slider.append("text")
        .attr("class", "label")
        .attr("text-anchor", "middle")
        .text(formatD3ToDate(startDate))
        .attr("transform", `translate(0,${-25})`)
      // 드래그 이벤트
      slider.call(d3.drag()
        .on("start.interrupt", function() { slider.interrupt(); })
        .on("start drag", function() {
          currentValue = d3.event.x;
          updateSlider(xScale.invert(currentValue));
        })
        .on("end", function() {
          updateChart(xScale.invert(currentValue))
        })
          // .container(slider)
          // .subject()
        );

      slider.selectAll("text")
        .data(xScale.ticks(12))
        .enter()
        .append("text")
        .attr("x", (d,i) => {
          return i * graphWidth / 12;
        })
        .attr("y", 30)
        .attr("text-anchor", "middle")
        .attr("font-size", "12px")
        .text(function(d) { return formatD3ToMonth(d); })

      addProgressEvent(playButton, step);
      // progress bar를 play button클릭으로 한칸씩 이동시키는 함수
      function step() {
        updateSlider(xScale.invert(currentValue));
        updateChart(xScale.invert(currentValue));
        currentValue = currentValue + (targetValue/151);
        if(currentValue > targetValue) {
          currentValue = 0;
          playButton.dispatch("click");
        }
      }
      // progress bar와 circle plot 업데이트 이벤트 함수
      function updateSlider(currentHandle) {
        handle
          .attr("cx", xScale(currentHandle));
        label
          .attr("x", xScale(currentHandle))
          .text(formatD3ToDate(currentHandle));
      }
      function updateChart(currentHandle) {
        let date = formatD3ToTime(currentHandle);
        let OneDayData = preProcess(json, date).slice(11,31);
        if(OneDayData.length !== 0){
          console.log(OneDayData);
          updateBarPlot(OneDayData)
        }
      }
/**
 * barChart part
 */
      let date = "2019-01-02 00:00:00";
      let OneDayData = preProcess(json, date).slice(11,31);
    
      const svgBar = d3.select("#bar-chart");
      const barWidth = 800;
      const barHeight = 300;
      const margin2 = {top:20, right:100, bottom:40, left:100};
      const graphWidth2 = barWidth - margin2.right - margin2.left;
      const graphHeight2 = barHeight - margin2.top - margin2.bottom;
      let barChart = drawSVG(svgBar, barWidth, barHeight, margin2);

      const xValue = 'Marcap';
      const yValue = 'Name';
      
      const xAxisGroup = barChart.append("g")
        .attr("transform", `translate(0,${graphHeight2})`)
        .transition().duration(1200);
      const yAxisGroup = barChart.append("g")
        .transition().duration(1200);
      
      const xScaleBar = d3.scaleLinear();
      const xAxis = d3.axisBottom(xScaleBar)
        .ticks(4)
        .tickFormat(d => d + " 원");
      const yScaleBar = d3.scaleBand();
      const yAxis = d3.axisLeft(yScaleBar);

      const colorScale = d3.scaleLinear()
        .domain([0, 50])
        .range(["#222","#ccc"])
        .clamp(true);

      const rects1 = drawBarPlot(barChart, OneDayData); 

      function updateBarPlot(OneDayData) {
        xScaleBar 
          .domain([0, d3.max(OneDayData, d => +d.Marcap)])
          .range([0, graphWidth2]);
        yScaleBar
          .domain(OneDayData.map(OneDayData => OneDayData.Name))
          .range([0, graphHeight2]);
        let rects = svgBar.select("g").selectAll("rect")
        rects
          // .attr("fill", (d,i) => colorScale(i))
          .attr("y", d => {
            return yScaleBar(d[yValue])
          });
        rects = svgBar.select("g").selectAll("rect").data(OneDayData)
        rects.exit().remove()
        rects.enter().append("rect")
        rects.transition()
          .duration(400)
          .attr("fill", (d,i) => colorScale(i))
          .attr("width", d=> xScaleBar(d[xValue]))
          .attr("y", d => {
            return yScaleBar(d[yValue])
          })
        rects.on("click", (d,i) => {
          console.log(d);
        })
        xAxisGroup.call(xAxis);
        yAxisGroup.call(yAxis);
      }
      function drawBarPlot(selection, OneDayData) {
        xScaleBar 
          .domain([0, d3.max(OneDayData, d => +d.Marcap)])
          .range([0, graphWidth2]);
        yScaleBar
          .domain(OneDayData.map(OneDayData => OneDayData.Name))
          .range([0, graphHeight2])
          .paddingInner(0.2)
          .paddingOuter(0.2);
        xAxisGroup.call(xAxis);
        yAxisGroup.call(yAxis);
        const rects = selection
          .selectAll("rect")
          .data(OneDayData);
        rects
          .enter()
          .append("rect")      
          .attr("class", "bar-rect")
          .attr("fill", (d,i) => colorScale(i))
          .attr("x", 1)
          .attr("y", d =>{ 
            console.log(d[yValue]);
            return yScaleBar(d[yValue])
          })
          .attr("height", yScaleBar.bandwidth)
          // .on("mouseover", function(){
          //   d3.select(this)
          //     .transition()
          //     .duration(10)
          //     .attr("fill", "black")
          //     .attr("height", () => yScaleBar.bandwidth() * 1.5)
          // })
          // .on("mouseout", function(d){
          //   d3.select(this)
          //     .transition()
          //     .duration(10)
          //     .attr("fill", "orange")
          //     .attr("height", yScaleBar.bandwidth)
          // })
          .transition()
          .duration(10)
          .delay((d,i) => i * 20)
          .attr("width", d=> xScaleBar(d[xValue]))
        rects.exit().remove();
        yAxisGroup.selectAll("text") 
          .transition()
          .duration(10)
          .delay((d, i) => i * 20)
          // .attr("transform", "rotate(-45)")
          .attr("text-anchor", "end")
          .attr("fill", "orange")
          .style("font-weight", "bold")
          .style("font-size", "8px")
          .style("opacity", 1)

        return rects;
      }

      function addProgressEvent(selection, step) {
        let timer;
        selection.on("click", function() {
          const button = d3.select(this);
          if(button.text() == "Pause") {
            clearInterval(timer);
            button.text("Play");
          }
          else {
            timer = setInterval(step, 400);
            button.text("Pause");
          }
        })
        return selection;
      }
    },
  }
}
</script>

<style>
.user1 {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.svg-wrap {
  width: 100%;
}
/* 버튼 설정 */
#play-button {
  background: #f08080;
  padding-right: 26px;
  border-radius: 3px;
  border: none;
  color: white;
  margin: 0;
  padding: 0 12px;
  width: 60px;
  cursor: pointer;
  height: 30px;
}
#play-button:hover {
  background-color: #696969;
}    
/* progress bar 트랙 설정 */
.ticks {
  font-size: 10px;
}
.track,
.track-inset,
.track-overlay {
  stroke-linecap: round;
}
.track {
  stroke: #000;
  stroke-opacity: 0.3;
  stroke-width: 10px;
}
.track-inset {
  stroke: #dcdcdc;
  stroke-width: 8px;
}
.track-overlay {
  pointer-events: stroke;
  stroke-width: 50px;
  stroke: transparent;
  cursor: crosshair;
}
.handle {
  fill: #fff;
  stroke: #000;
  stroke-opacity: 0.5;
  stroke-width: 1.25px;
}
</style>