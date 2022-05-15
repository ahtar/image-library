<template>
  <div class="home">
    <div class="block">
      <card-new-big @click="storeCollectionCreate.open"/>
      <router-link to="/collection" v-for="(collection, i) in store.collections" :key="i">
        <card-collection-big :fileHandle="collection.thumbnail" @click="viewCollection(i)"/>
      </router-link>
    </div>
  </div>
  <screen-init v-if="storeInit.visible" @data="addCollections"/>

  <transition-fade>
    <form-collection-create v-if="storeCollectionCreate.visible"/>
  </transition-fade>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue'

import CardCollectionBig from '@/components/CardCollectionBig.vue'
import CardNewBig from '@/components/CardNewBig.vue'
import ScreenInit from '@/components/ScreenInit.vue'
import TransitionFade from '@/components/TransitionFade.vue'
import FormCollectionCreate from '@/components/formCollectionCreate.vue'

import { useCollections } from '@/store/collections'
import { useInitStore } from '@/store/modals/modal-init'
import { useCollectionCreateStore } from '@/store/forms/form-collection-create'

import useFileSystem from '@/composables/file-system'



export default defineComponent({
  components: {
    CardCollectionBig,
    CardNewBig,
    ScreenInit,
    TransitionFade,
    FormCollectionCreate
  },

  setup() {
    const store = useCollections();
    const storeInit = useInitStore();
    const storeCollectionCreate = useCollectionCreateStore();
    const { checkMainFolderAccess, initLoadCollections } = useFileSystem();

    onMounted(async() => {
      if(!store.collectionsInitialized) {
          const status = await checkMainFolderAccess();
        if(!status) {
          storeInit.show();
        } else {
          const data = await initLoadCollections();
          store.addCollection(data);
        }
      }
    });

    function viewCollection(i: number) {
      store.setActiveCollection(i);
    }

    function addCollections(data: Collection[]) {
      store.addCollection(data);
      storeInit.hide();
    }

    return {
      store,
      storeInit,
      viewCollection,
      addCollections,
      storeCollectionCreate,
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

