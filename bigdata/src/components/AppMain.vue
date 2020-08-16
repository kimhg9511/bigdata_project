<template>
  <div id="carousel">
    <router-link 
      v-if="currentIdx != 0"
      :to="prev ? prev : ''"
      class="carousel-slide left"
    />
    <transition
      :name="`slider-${this.direction}`"
      mode="out-in"
      @before-enter="setTransition"
      @enter="triggerTransition"
    >
      <router-view id="wrap"/>
    </transition>
    <router-link
      v-if="currentIdx != domains.length-1"
      :to="next ? next : ''"
      class="carousel-slide right"
    />
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
    },
    currentIdx() {
      return this.domains.findIndex(domain => domain.url == this.url);
    },
    prev() { 
      const prevIdx = this.currentIdx - 1
      return this.currentIdx != 0
        ? this.urls[prevIdx]
        : 0;
    },
    next() {
      return this.currentIdx != this.domains.length-1
        ? this.urls[this.currentIdx + 1]
        : 0;
    }
  },
  mounted() {
    const goToPrev = this.goToPrev;
    const goToNext = this.goToNext;
    window.addEventListener('keyup', function(event) {
      if (event.keyCode === 37) { 
        goToPrev();
      }
      else if (event.keyCode === 39) { 
        goToNext();
      }
      else {
        return;
      }
    });
  },
  methods: {
    setTransition(el){
      if(this.url == "intro") {
        const childs = [...el.childNodes];
        childs.map((item)=> {
          item.style.transition = "all 2s ease"
          item.style.opacity = "0"
          item.style.transform = "translateX(-10%)"
        });
      }
    },
    triggerTransition(el, done){
      if(this.url == "intro") {
        const childs = [...el.childNodes];
        childs.map((item, index)=> {
          setTimeout(function(){
            item.style.opacity = "1"
            item.style.transform = "translateX(0)"
          }
          ,400*index)
        });
        done();
      }
    },
    goToPrev(){
      const prev = this.prev || "intro";
      this.$router.push(prev)
    },
    goToNext(){
      const next = this.next || "home";
      this.$router.push(next)
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
  },
}
</script>

<style scoped>
#wrap {
  height: 100%;
}
#carousel {
  padding: 0.5%;
  min-height: 600px;
  flex-grow: 1;
  position: relative;
  overflow-x: hidden;
  overflow-y: overlay;
  background-color: #555;
}
.carousel-slide {
  transition: background-color 0.4s;
  position: absolute;
  top: 50%;
  width: 5%;
  height: 50px;
  transform: translateY(-50%);
  z-index: 10000;
}
.carousel-slide:hover {
  background-color: #555;
}
.left {
  left: 0;
}
.right {
  right: 0;
}

::-webkit-scrollbar {
  width: 4px;
}
::-webkit-scrollbar-track {
  background-color: rgba(255, 255, 255, 0);
}
::-webkit-scrollbar-thumb {
  border-radius: 5px;
  background-color: #333;
}
</style>