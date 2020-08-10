<template>
  <div class="cloud-view">
    <word-cloud></word-cloud>
    <div id="content-box">{{ data }}</div>
  </div>
</template>
<script>
import * as d3 from "d3"
import WordCloud from "../components/WordCloud"
export default {
  components: {
    WordCloud
  },
  data() {
    return {
      data: Object,
    }
  },
  mounted() {
    this.setContent();
  },
  methods: {
    setContent() {
      const self = this;
      d3.select("#content-box")
        .on("update", () => {
          self.data = d3.event.detail.data;
        })
    }
  }
}
</script>

<style scoped>
.cloud-view {
  display: flex;
  justify-content: start;
}
#text-cloud {
  width: 50%;
}
#content-box {
  width: 50%;
}
</style>