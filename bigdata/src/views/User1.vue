<template>
  <div class="progress">
    <button id="play-button">Play</button>
  </div>
</template>

<script>
import * as d3 from "d3";
import { drawSVG, drawSlider } from "../assets/drawChart.js";
export default {
  mounted() {
    this.drawProgress();
  },
  methods: {
    drawProgress() {
      // svg 크기 설정
      const svgWidth = 960;
      const svgHeight = 500;
      const margin = {top:50, right:50, bottom:0, left:50}
      const graphWidth = svgWidth - margin.left - margin.right;
      const graphHeight = svgHeight - margin.top - margin.bottom;
// Progress Slider
      /** 무슨값? 
       *  moving        : slider 버튼을 클릭했을때 자동으로 움직일지 bool값
       *  currentValue  : 현재 progress bar의 위치(초기값: 시작위치)
       *  targetValue   : 목표 progress bar의 위치(초기값: 그래프 끝위치)
       * */ 
      let moving = false;
      let currentValue = 0;
      let targetValue = graphWidth;
// Circle Plot
      /** 무슨값?
       * dataset : csv파일을 불러와서 담을 변수
       * timer : setInterval(이벤트 실행 간격)을 저장하는 변수
       */
      let dataset;
      let timer;
      // 날짜 포맷 설정
      const formatDateIntoYear = d3.timeFormat("%Y");
      const formatDate = d3.timeFormat("%b %Y");
      const parseDate = d3.timeParse("%m/%d/%y");
      // 시작일, 종료일 설정
      const startDate = new Date("2004-11-01");
      const endDate = new Date("2017-04-01");
      // svg 생성
      const svg = d3.select(".progress");
      // playButton 지정
      const playButton = d3.select("#play-button");
      
      const graph = this.drawSVG(svg, svgWidth, svgHeight, margin);
      // xScale값 지정(slider)
      const xScale = d3.scaleTime()
        .domain([startDate, endDate])
        .range([0, targetValue])
        .clamp(true);
      
      this.drawSlider(graph, xScale)
      // slider 틀 생성(g)
      // const slider = graph.append("g")
      //   .attr("class", "slider")
      //   // .attr("transform", `translate(${margin.left},${graphHeight/5})`);

      // slider.append("line")
      //     .attr("x1", xScale.range()[0])
      //     .attr("x2", xScale.range()[1])
      //     .attr("class", "track")
      //   .select(function() {
      //     // 나의 부모 노드에 나의 클론(deep copy=true)를 자식 노드로 추가한다.
      //     return this.parentNode.appendChild(this.cloneNode(true)); 
      //   })
      //     .attr("class", "track-inset")
      //   .select(function() {
      //     return this.parentNode.appendChild(this.cloneNode(true));
      //   })
      //     .attr("class", "track-overlay")
      //   .call(d3.drag()
      //     .on("start.interrupt", function() { slider.interrupt(); })
      //     .on("start drag", function() {
      //         currentValue = d3.event.x;
      //         update(xScale.invert(currentValue)); 
      //       })
      //   );
      // track x축 그리기(단위: 연도)
      slider.insert("g", ".track-overlay")
        .attr("class", "ticks")
        .attr("transform", `translate(0,${18})`)
      .selectAll("text")
        .data(xScale.ticks(10))
        .enter()
        .append("text")
        .attr("x", xScale)
        .attr("y", 10)
        .attr("text-anchor", "middle")
        .text(function(d) { return formatDateIntoYear(d); });

      // track handle 그리기(드래그 가능한 동그라미)
      let handle = slider.insert("circle", ".track-overlay")
        .attr("class", "handle")
        .attr("r", 9)

      // // track label 그리기(handle 위를 따라다니며 연-월 표시)
      let label = slider.append("text")
        .attr("class", "label")
        .attr("text-anchor", "middle")
        .text(formatDate(startDate))
        .attr("transform", `translate(0,${-25})`)
      
      // plot 바탕 생성
      let plot = graph.append("g")
        .attr("class", "plot")
        .attr("transform", `translate(${margin.left},${margin.top})`);


      // csv 불러오기
      // d3.csv('구분자', '파일명'= public 폴더 안에서 절대경로로 참조, 컬럼 데이터 타입 정의 함수)
      // .then(불러온 csv 데이터로 할 작업)
      // d3.v5부턴 promise 사용
      d3.dsv(",","/data/circle.csv",prepare)
        .then(function(data){
          dataset = data
          drawPlot(dataset[dataset.length-1]);
          
          // 버튼 이벤트 생성
          playButton.on("click", function() {
            const button = d3.select(this);
            if(button.text() == "Pause") {
              moving = false;
              clearInterval(timer);
              button.text("Play");
            }
            else {
              moving = true;
              timer = setInterval(step, 10);
              button.text("Pause");
            }
            console.log("Slider moving: " + moving);
          })
        })
        .catch(function(error){
          console.log(error);
        })

      // csv 데이터 전처리 함수
      function prepare(d) {
        d.id = d.id;
        d.date = parseDate(d.date);
        return d;
      }

      // data를 받아 circle plot을 그리는 함수
      function drawPlot(data) {
        let locations = plot.selectAll(".location")
          .data(data);
      
        locations.enter()
          .append("circle")
          .attr("class", "location")
          .attr("cx", function(d) { return xScale(d.date); })
          .attr("cy", graphHeight/2)
          .style("fill", function(d) { return d3.hsl(d.date/1000000000, 0.8, 0.8); })
          .style("stroke", function(d) { return d3.hsl(d.date/1000000000, 0.7, 0.7); })
          .style("opacity", 0.5)
          .attr("r", 8)
            .transition()
            .duration(400)
            .attr("r", 50)
            .transition()
            .attr("r", 8);
        locations.exit().remove();
      }
      // progress bar를 play button클릭으로 한칸씩 이동시키는 함수
      function step() {
        update(xScale.invert(currentValue));
        currentValue = currentValue + (targetValue/151);
        if(currentValue > targetValue) {
          moving = false;
          currentValue = 0;
          clearInterval(timer);
          playButton.text("Play");
          console.log("Slider moving: " + moving);
        }
      }
      // progress bar와 circle plot 업데이트 이벤트 함수
      function update(h) {
        handle.attr("cx", xScale(h));
        label.attr("x", xScale(h))
          .text(formatDate(h));

        const newData = dataset.filter(function(d) {
          return d.date < h;
        })
        drawPlot(newData);
      }
    },
    drawSVG,
    drawSlider,
  }
}
</script>

<style>
.progress {
  display: flex;
  flex-direction: column;
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