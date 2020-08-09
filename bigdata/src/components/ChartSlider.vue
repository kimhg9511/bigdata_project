<template>
  <div id="slider-wrap">
  </div>
</template>

<script>
import * as d3 from "d3"
export default {
  mounted() {
    this.drawSlider();
  },
  methods: {
    drawSlider() {
      /**
 * slider part
 */ 
      const chart = {
        width: 960,
        height: 100,
        margin: {
          top: 40,
          right: 50,
          bottom: 15,
          left: 50
        },
        graphWidth() {
          return this.width - this.margin.left - this.margin.right;
        },
        graphHeight() { 
          return this.height - this.margin.top - this.margin.bottom;
        }
      };
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
      // playButton 지정
      // const playButton = d3.select("#play-button")
      // playButton
      //   .style("position", "absolute")
      //   .style("top", "60%")
      //   .style("left", "50%")
      //   .style("transform", "translateX(-50%)");
      // svg 생성
      const svgSlider = d3.select("#slider-wrap")
        .classed("svg-container", true)
        .append("svg")
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("viewBox", `0 0 ${chart.width} ${chart.height}`)
        .classed("svg-content", true)
      const playButton = svgSlider.append("g")
        .append("rect")
        .attr("width", "100")
        .attr("height", "30")
        .attr("x", "45%")
        .attr("y", "60%")
        .attr("fill", "#ddd")
      playButton
        .append("text")
        // .attr("x", "50%")
        // .attr("y", "80%")
        .attr("text-anchor","middle")
        .text("play")
      // xScale값 지정(slider)
      const xScale = d3.scaleTime()
        .domain([startDate, endDate])
        .range([0, targetValue])
        .clamp(true);
      // slider 그리기
      const slider = svgSlider.append("g")
        .attr("class", "slider")
        .attr("transform", `translate(${chart.margin.left},${chart.margin.top})`)
      
      slider.append("line")
        .attr("x1", xScale.range()[0])
        .attr("x2", xScale.range()[1])
        .attr("class", "track")
        .select(function() {
          return this.parentNode.appendChild(this.cloneNode(true)); 
        })
        .attr("class", "track-inset")
        .select(function() {
          return this.parentNode.appendChild(this.cloneNode(true));
        })
        .attr("class", "track-overlay")
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
          currentValue = d3.event.x - chart.margin.left;
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
      function addProgressEvent(selection, step) {
        let timer;
        selection.on("click", function() {
          const button = d3.select(this);
          if(button.text() == "Pause") {
            clearInterval(timer);
            // button.text("Play");
          }
          else {
            timer = setInterval(step, 400);
            // button.text("Pause");
          }
        })
        return selection;
      }
      function step() {
        updateSlider(xScale.invert(currentValue));
        // updateChart(xScale.invert(currentValue));
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
    }
  }
}
</script>

<style>
#slider-wrap {
  position: relative;
  padding-top: 15%;
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