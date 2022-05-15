<template>

  <router-view/>

  <message-notification/>

  <transition-fade>
    <message-prompt v-if="storePrompt.visible"/>
  </transition-fade>

</template>


<script lang="ts">
import { defineComponent, onMounted } from 'vue'

import MessagePrompt from '@/components/MessagePrompt.vue'
import MessageNotification from '@/components/MessageNotification.vue'
import TransitionFade from '@/components/TransitionFade.vue'

import { usePromptStore } from '@/store/modals/modal-prompt'

export default defineComponent({
  components: {
    MessageNotification,
    MessagePrompt,
    TransitionFade,
  },
  setup() {
    const storePrompt = usePromptStore();

    onMounted(() => {
      console.clear();
    });

    return {
      storePrompt,
    }
  }
})
</script>


<style lang="scss">

html {
  font-size: $base-font-size * 0.6;
  line-height: $base-line-height;

  @media #{$mq-medium} {
    font-size: $base-font-size * 0.8;
    line-height: $base-line-height;
  }

  @media #{$mq-large} {
    font-size: $base-font-size;
  }

  @media #{$mq-xlarge} {
    font-size: $base-font-size*1.5;
  }

  @media #{$mq-xxlarge} {
    font-size: $base-font-size*2;
  }
}
body {
  margin: 0;

}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  width: 100vw;
  height: 100vh;
  background-color: $color-dark-0;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
