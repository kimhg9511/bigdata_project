<template>
  <div id="slider-wrap">
  </div>
</template>

<script>
import * as d3 from "d3"
export default {
  data() {
    return {
      chartName: '#slider-wrap',
      width: 1600,
      height: 300,
      margin: {
        top: 100,
        right: 50,
        bottom: 15,
        left: 50
      },
      currentValue: 0,
      currentIdx: 0,
      dataset: null,
      timer: null,
      startDate: new Date("2019-01-01 00:00:00"),
      endDate: new Date("2019-12-30 00:00:00"),
      formatD3ToMonth: d3.timeFormat("%b %Y"),
      formatD3ToMonthDate: d3.timeFormat("%b-%d"),
      formatD3ToDate: d3.timeFormat("%d %b"),
      formatD3ToTime: d3.timeFormat("%Y-%m-%d 00:00:00"),
      parseMonthToD3: d3.timeParse("%b-%d-%Y"),
      parseDateToD3: d3.timeParse("%y-%m-%d"),
    }
  },
  computed: {
    graphWidth() {
      return this.width - this.margin.left - this.margin.right;
    },
    graphHeight() { 
      return this.height - this.margin.top - this.margin.bottom;
    },
    month() {
      return this.$store.state.month;
    },
    xScale() {
      return d3.scaleTime()
        .domain([this.startDate, this.endDate])
        .range([0, this.graphWidth])
        .clamp(true);
    },
  },
  mounted() {
    this.drawSlider();
  },
  methods: {
    drawSlider() {
      const self = this;
      // svg 생성
      const svg = d3.select(this.chartName)
        .classed("svg-container", true)
        .append("svg")
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("viewBox", `0 0 ${this.width} ${this.height}`)
        .classed("svg-content", true)      
      // playButton 지정
      const playButton = svg.append("g").call(this.drawButton);
      // slider 그리기
      const slider = svg.append("g")
        .attr("class", "slider")
        .attr("transform", `translate(${this.margin.left},${this.margin.top})`)  
      slider.call(this.drawSliderBar);
      // 드래그 이벤트
      slider.call(d3.drag()
        .on("start.interrupt", function() { slider.interrupt(); })
        .on("start drag", function() {
          self.currentValue = self.xScale(self.xScale.invert(d3.event.x - self.margin.left));
        })
        .on("end", () => {
          const month = this.formatD3ToMonthDate(this.xScale.invert(this.currentValue));
          this.$store.commit("changeMonth", month);
        })
      );
      playButton.call(this.addProgressEvent, this.step);
    },
    drawButton(selection) {
      const button = selection.append("g")
        .attr("class", "play-button")
      button
        .append("rect")
        .attr("width", "100")
        .attr("height", "30")
        .attr("x", "750")
        .attr("y", "200")
        .attr("fill", "#1e88e5")
      button
        .append("text")
        .attr("x", "800")
        .attr("y", "223")
        .attr("text-anchor","middle")
        .attr("fill", "#e5e5e5")
        .style("font-family", "NanumSquareRound")
        .style("font-size", "24px")
        .style("font-weight", "900")
        .text("Play")
    },
    drawSliderBar(selection) {
      selection.append("line")
        .attr("x1", this.xScale.range()[0])
        .attr("x2", this.xScale.range()[1])
        .attr("class", "track")
        .select(function() {
          return this.parentNode.appendChild(this.cloneNode(true)); 
        })
        .attr("class", "track-inset")
        .select(function() {
          return this.parentNode.appendChild(this.cloneNode(true));
        })
        .attr("class", "track-overlay")
      selection.selectAll("text")
        .data(this.xScale.ticks(12))
        .enter()
        .append("text")
        .attr("class", "domain")
        .attr("x", d => this.xScale(d))
        .attr("y", 40)
        .text(d => this.formatD3ToMonth(d));
      selection.insert("circle", ".track-overlay")
        .attr("class", "handle")
        .attr("r", 9)
      selection.append("text")
        .attr("class", "label")
        .text(this.formatD3ToDate(this.startDate))
        .attr("transform", `translate(0,${-25})`)
    },
    addProgressEvent(selection, step) {
      let timer;
      selection.on("click", function() {
        const button = d3.select(this);
        if(button.text() == "Pause") {
          clearInterval(timer);            
          button.select("rect").transition().duration(400).ease(d3.easeLinear)
            .attr("fill", "#1e88e5")
          button.select("text").text("Play");
        }
        else {
          timer = setInterval(() => {
            step(selection)
          }, 100);
          button.select("rect").transition().duration(400).ease(d3.easeLinear)
            .attr("fill", "#e53935")
          button.select("text").text("Pause");
        }
      })
      return selection;
    },
    step(selection) {
      this.currentIdx += 1;
      this.currentValue = this.xScale(this.xScale.ticks(365)[this.currentIdx-1]);
      const month = this.formatD3ToMonthDate(this.xScale.invert(this.currentValue));
      d3.select("#bar-chart-marcap>svg>g").dispatch("update", {detail: { date: this.formatD3ToTime(this.xScale.invert(this.currentValue))}});
      if(month.split("-")[1] == "19") {
        this.$store.commit("changeMonth", month);
      }
      if(this.currentIdx == 364) {
        selection.dispatch("click");
      }
    }
  },
  watch: {
    'currentValue' (newValue, oldValue) {
      const ticks = this.xScale.ticks(365)
      this.currentIdx = ticks.map(el => this.xScale(el) <= newValue).indexOf(false);
      if(d3.select(`${this.chartName} .play-button>text`).node().textContent == "Pause") {
        d3.select(`${this.chartName} .handle`)
          .transition().duration(100)
          .attr("cx", newValue);
        d3.select(`${this.chartName} .label`)
          .transition().duration(100)
          .attr("x", newValue)
          .text(this.formatD3ToDate(this.xScale.invert(newValue)));
      }
      else {
        d3.select(`${this.chartName} .handle`)
          .attr("cx", newValue);
        d3.select(`${this.chartName} .label`)
          .attr("x", newValue)
          .text(this.formatD3ToDate(this.xScale.invert(newValue)));
      }
    },
    'month' (month) {
      if(month != undefined){
        const objMonth = this.parseMonthToD3(`${month}-2019`);
        const domainMonth = this.formatD3ToTime(objMonth);
        this.currentValue = this.xScale(new Date(domainMonth));
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
#slider-wrap .track,
#slider-wrap .track-inset,
#slider-wrap .track-overlay {
  stroke-linecap: round;
}
#slider-wrap .track {
  stroke: #333;
  stroke-opacity: 0.7;
  stroke-width: 10px;
}
#slider-wrap .track-inset {
  stroke: #e5e5e5;
  stroke-width: 8px;
}
#slider-wrap .track-overlay {
  pointer-events: stroke;
  stroke-width: 50px;
  stroke: transparent;
  cursor: crosshair;
}
#slider-wrap .domain {
  fill: #e5e5e5;
  text-anchor: middle;
}
#slider-wrap .handle {
  fill: #ffeb3b;
  stroke: #333;
  stroke-opacity: 0.3;
  stroke-width: 1.25px;
}
#slider-wrap .label {
  font-family: "NanumBarunpen";
  fill: #ffeb3b;
  text-anchor: middle;
  font-size: 2rem;
}
</style>