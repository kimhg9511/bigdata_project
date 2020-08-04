<template>
  <div class="carousel">
    <transition
      :name="`slider-${this.direction}`"
      @before-enter="setTransition"
      @after-enter="triggerTransition"
    >
      <router-view class="wrap"/>
    </transition>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
export default {
  data() {
    return {
      direction: '',
    }
  },
  computed: {
    ...mapState(['domains']),
    ...mapGetters(['urls']),
    url() {
      return this.$route.path.replace('/','');
    }
  },
  methods: {
    setTransition(el){
      // this.$store.commit()
      if(this.url == "intro") {
        const childs = [...el.childNodes];
        childs.map((item)=> {
          item.style.transition = "all 2s ease"
          item.style.opacity = "0"
          item.style.transform = "translateX(-10%)"
        });
      }
    },
    triggerTransition(el){
      if(this.url == "intro") {
        const childs = [...el.childNodes];
        childs.map((item, index)=> {
          setTimeout(function(){
            item.style.opacity = "1"
            item.style.transform = "translateX(0)"
          }
          ,300*index)
        });
      }
    }
  },
  // 캐러셀 슬라이드 방향 결정
  watch: {
    '$route' (to, from) {
      const toDepth = to.path.replace('/','');
      const fromDepth = from.path.replace('/','');
      const fromIdx = this.urls.indexOf(fromDepth);
      const toIdx = this.urls.indexOf(toDepth);
      if(fromDepth == "") {
        this.direction = 'fade';
      }
      else {
        this.direction = toIdx > fromIdx ? 'left' : 'right';
      }
    }
  }
}
</script>

<style scoped>
.carousel {
  min-height: 600px;
  flex-grow: 1;
  position: relative;
}
.carousel>.wrap {
  width: 100%;
  height: 100%;
  /* height: 100%; */
}
</style>