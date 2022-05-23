<template>
  <div class="home">
    <div class="block">
      <card-new-big @click="storeCollectionCreate.open"/>
      <router-link :to="link(collection)" v-for="(collection, i) in store.collections" :key="i">
        <card-collection-big :fileHandle="collection.thumbnail"/>
      </router-link>
    </div>
  </div>

  <transition-fade>
    <form-collection-create v-if="storeCollectionCreate.visible"/>
  </transition-fade>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import CardCollectionBig from '@/components/CardCollectionBig.vue'
import CardNewBig from '@/components/CardNewBig.vue'
import TransitionFade from '@/components/TransitionFade.vue'
import FormCollectionCreate from '@/components/formCollectionCreate.vue'

import { useCollections } from '@/store/collections'
import { useCollectionCreateStore } from '@/store/forms/form-collection-create'



export default defineComponent({
  components: {
    CardCollectionBig,
    CardNewBig,
    TransitionFade,
    FormCollectionCreate
  },

  setup() {
    const store = useCollections();
    const storeCollectionCreate = useCollectionCreateStore();

    function link(collection: Collection) {
      return '/collections/' + collection.manifest.name;
    }

    return {
      store,
      storeCollectionCreate,
      link
    }
  },
})
</script>

<style lang="scss" scoped>
  .home {
    padding-top: 15vh;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .block {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: row;
    flex-wrap: wrap;
  }
</style>

