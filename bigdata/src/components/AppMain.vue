<template>
  <div id="carousel">
    <router-link 
      v-if="currentIdx != 0"
      :to="prev ? prev : ''"
      class="carousel-slide left"
    />
    <transition
      :name="`slider-${this.direction}`"
      @before-enter="setTransition"
      @after-enter="triggerTransition"
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
  methods: {
    setTransition(el){
      console.log(this.prev);
      console.log(this.next);
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
#carousel {
  min-height: 600px;
  flex-grow: 1;
  position: relative;
  overflow-x: hidden;
  overflow-y: scroll;
}
.carousel-slide {
  transition: background-color 0.4s;
  position: absolute;
  top: 0;
  width: 10%;
  height: 100%;
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
#carousel>#wrap {
  width: 100%;
  height: 100%;
  /* height: 100%; */
}
::-webkit-scrollbar {
  width: 10px;  /*세로축 스크롤바 길이*/
  /* height: 20px;  가로축 스크롤바 길이 */
}
::-webkit-scrollbar-track {
  background-color: inherit;
}
/* ::-webkit-scrollbar-track-piece {
  background-color: gray;
} */
::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background-color: #333;
}
/* ::-webkit-scrollbar-button {
  background-color: darkblue;
  width: 20px;
  height: 10px;
} */
/* ::-webkit-scrollbar-button:start {
  background-color: red; Top, Left 방향의 이동버튼
}
::-webkit-scrollbar-button:end {
  background-color: orange; Bottom, Right 방향의 이동버튼
} */
/* ::-webkit-scrollbar-button:vertical:increment {
}
::-webkit-scrollbar-button:vertical:decrement {
} */
/* ::-webkit-scrollbar-corner {
  background-color: violet; 우측 하단의 코너 부분
}
::-webkit-resizer {
  background-color: green;
} */
</style>