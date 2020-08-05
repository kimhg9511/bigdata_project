<template>
  <div class="progress">
    <button id="play-button">Play</button>
  </div>
</template>

<script>
import * as d3 from "d3";

export default {
  mounted() {
    this.drawProgress();
  },
  methods: {
    drawProgress() {
      // svg 크기 설정
      const svgWidth = 960;
      const svgHeight = 500;
      // 날짜 포맷 설정
      const formatDateIntoYear = d3.timeFormat("%Y");
      const formatDate = d3.timeFormat("%b %Y");
      const parseDate = d3.timeParse("%m/%d/%y");
      // 시작일, 종료일 설정
      const startDate = new Date("2004-11-01");
      const endDate = new Date("2017-04-01");
      // 그래프 크기 설정
      const margin = {top:50, right:50, bottom:0, left:50}
      const graphWidth = svgWidth - margin.left - margin.right;
      const graphHeight = svgHeight - margin.top - margin.bottom;
      // svg 생성
      const svg = d3.select(".progress")
        .append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight)

// Progress Slider
      /** 무슨값? 
       *  moving        : slider 버튼을 클릭했을때 자동으로 움직일지 bool값
       *  currentValue  : 현재 progress bar의 위치(초기값: 시작위치)
       *  targetValue   : 목표 progress bar의 위치(초기값: 그래프 끝위치)
       * */ 
      let moving = false;
      let currentValue = 0;
      let targetValue = graphWidth;

      // playButton 지정
      const playButton = d3.select("#play-button");
      
      // xScale값 지정(slider)
      const xScale = d3.scaleTime()
        .domain([startDate, endDate])
        .range([0, targetValue])
        .clamp(true);   

      // slider 틀 생성(g)
      const slider = svg.append("g")
        .attr("class", "slider")
        .attr("transform", `translate(${margin.left},${graphHeight/5})`);

      slider.append("line")
          .attr("x1", xScale.range()[0])
          .attr("x2", xScale.range()[1])
          .attr("class", "track")
        .select(function() {
          // 나의 부모 노드에 나의 클론(deep copy=true)를 자식 노드로 추가한다.
          return this.parentNode.appendChild(this.cloneNode(true)); 
        })
          .attr("class", "track-inset")
        .select(function() {
          return this.parentNode.appendChild(this.cloneNode(true));
        })
          .attr("class", "track-overlay")
        .call(
          d3.drag()
          .on("start.interrupt", function() { slider.interrupt(); })
          .on("start drag", function() {
              currentValue = d3.event.x;
              update(xScale.invert(currentValue)); 
          })
        )

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
      
// Circle Plot
      /** 무슨값?
       * dataset : csv파일을 불러와서 담을 변수
       * timer : setInterval(이벤트 실행 간격)을 저장하는 변수
       */
      let dataset;
      let timer;

      // plot 바탕 생성
      let plot = svg.append("g")
        .attr("class", "plot")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      d3.json("/data/menu.json")
        .then(function(data){
          const xAxisGroup = plot.append("g")
            .attr("transform", `translate(0,${graphHeight})`);
          const yAxisGroup = plot.append("g");

          const xScale = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.orders)])
            .range([0, graphHeight]);
          const yScale = d3.scaleBand()
            .domain(data.map(data => data.name))
            .range([500, 0])
            .paddingInner(0.2)
            .paddingOuter(0.2);
          
          const xAxis = d3.axisBottom(xScale)
            .ticks(3)
            .tickFormat(d => d + " orders");
          const yAxis = d3.axisLeft(yScale);

          xAxisGroup.call(xAxis);
          yAxisGroup.call(yAxis);
          yAxisGroup.selectAll("text")
            .attr("transform", "rotate(-45)")
            .attr("text-anchor", "end")
            .attr("fill", "orange")
            .style("font-weight", "bold")
            .style("font-size", "20px");

          dataset = data
          drawPlot(data, xScale, yScale);
          
          // // 버튼 이벤트 생성
          // playButton.on("click", function() {
          //   const button = d3.select(this);
          //   if(button.text() == "Pause") {
          //     moving = false;
          //     clearInterval(timer);
          //     button.text("Play");
          //   }
          //   else {
          //     moving = true;
          //     timer = setInterval(step, 10);
          //     button.text("Pause");
          //   }
          //   console.log("Slider moving: " + moving);
          // })
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

      // data를 받아 bar chart를 그리는 함수
      function drawPlot(data, xScale, yScale) {
        let rects = plot
          .selectAll("rect")
          .data(data);
        rects.enter()
          .append("rect")      
          .attr("width", d=> xScale(d.orders))
          .attr("height", yScale.bandwidth)
          .attr("fill", "orange")
          .attr("x", 1)
          .attr("y", d => yScale(d.name))
          .on("mouseover", function(){
            d3.select(this)
              .transition()
              .duration(1200)
              .attr("width",xScale(1500))
          })
          .on("mouseout", function(d){
            d3.select(this)
              .transition()
              .duration(1200)
              .attr("width", xScale(d.orders))
          })
        rects.exit().remove();
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
  }
}
</script>

<style>
.user1 {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 5rem;
}
/* 버튼 설정 */
#play-button {
  position: absolute;
  top: 140px;
  left: 50px;
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