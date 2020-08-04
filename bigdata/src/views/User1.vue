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
      // ??
      slider.append("line")
          .attr("class", "track")
          .attr("x1", xScale.range()[0])
          .attr("x2", xScale.range()[1])
        .select(function() {
          // 나의 부모 노드에 나의 클론(deep copy=true)를 자식 노드로 추가한다.
          return this.parentNode.appendChild(this.cloneNode(true)); 
        })
          .attr("class", "track-inset")
        .select(function() {
          return this.parentNode.appendChild(this.cloneNode(true));
        })
          .attr("class", "track-overlay")
        .call(d3.drag()
        .on("start.interrupt", function() { slider.interrupt(); })
        .on("start drag", function() {
            currentValue = d3.event.x;
            update(xScale.invert(currentValue)); 
          })
        );
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

      // track handle 그리기
      let handle = slider.insert("circle", ".track-overlay")
        .attr("class", "handle")
        .attr("r", 9)

      // // track label 그리기(handle 위를 따라다니며 연-월 표시)
      let label = slider.append("text")
        .attr("class", "label")
        .attr("text-anchor", "middle")
        .text(formatDate(startDate))
        .attr("transform", `translate(0,${-25})`)

      let dataset;

      let plot = svg.append("g")
        .attr("class", "plot")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      let timer;

      // d3.v4 에서는 이렇게 썼지만, v5부턴 promise 사용
      d3.dsv(",","/data/circle.csv",prepare)
        .then(function(data){
          dataset = data
          drawPlot(dataset[dataset.length-1]);
          
          playButton.on("click", function() {
            const button = d3.select(this);
            if(button.text() == "Pause") {
              moving = false;
              clearInterval(timer);
              button.text("Play");
            }
            else {
              moving = true;
              timer = setInterval(step, 100);
              button.text("Pause");
            }
            console.log("Slider moving: " + moving);
          })
        })
        .catch(function(error){
          console.log(error);
        })

      function prepare(d) {
        d.id = d.id;
        d.date = parseDate(d.date);
        return d;
      }

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
            .attr("r", 25)
            .transition()
            .attr("r", 8);
        locations.exit().remove();
      }

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