<template>
  <div class="cloud-view">
    <word-cloud></word-cloud>
    <force-detected-tree></force-detected-tree>
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
}
</script>

<style scoped>
@media screen and (min-width: 1025px){
  .cloud-view {
    display: flex;
  }
  #text-cloud {
    width: 50%;
  }
  #force-detected-tree {
    width: 50%;
  }
}
</style>