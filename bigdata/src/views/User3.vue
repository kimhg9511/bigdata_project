<template>
  <div class="cloud-view">
    <word-cloud></word-cloud>
    <!-- <div id="content-box">{{ data }}</div> -->
    <!-- <force-detected-tree></force-detected-tree> -->
  </div>
</template>
<script>
import * as d3 from "d3"
import WordCloud from "../components/WordCloud"
import ForceDetectedTree from "../components/ForceDetectedTree"
export default {
  components: {
    ForceDetectedTree,
    WordCloud,
  },
  data() {
    return {
      data: Object,
      componentKey : 0,
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
    },
  }
}
</script>

<style scoped>
/* .cloud-view {
  display: flex;
}
#text-cloud {
  width: 70%;
}
#content-box {
  width: 30%;
} */
</style>