<template>
  <div class="carousel">
    <transition
      :name="`slider-${this.direction}`"
      class="slide"
    >
      <router-view />
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
  },
  methods: {
    test(){
      console.log('test');
    }
  },
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

<style>
.carousel {
  flex-grow: 1;
  position: relative;
}
.carousel>div{
  width: 100%;
  height: 100%;
}

/* slide-right */
.slider-right-enter-active, .slider-right-leave-active {
  transition: all .8s ease;
  position: absolute;
  top: 0;
}
.slider-right-enter {
  transform: translateX(-100%);
}
.slider-right-leave-to {
  transform: translateX(100%);
}

/* slide-left */
.slider-left-enter-active, .slider-left-leave-active {
  transition: all .8s ease;
  position: absolute;
  top: 0;
}
.slider-left-enter {
  transform: translateX(100%);
}
.slider-left-leave-to {
  transform: translateX(-100%);
}

/* init trans */
.slider-fade-enter-active{
  transition: all 2s ease;
  opacity: 0;
}
.slider-fade-enter-to {
  opacity: 1;
}
</style>