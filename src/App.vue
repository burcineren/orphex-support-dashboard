<template>
  <div class="min-h-screen bg-gray-50">
    <AppHeader />

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <router-view />
    </div>

    <RequestDetail
      v-if="uiStore.isDetailModalOpen"
      :request-id="uiStore.selectedRequestId"
      @close="uiStore.closeDetail"
    />
  </div>
</template>

<script setup>
import { useUIStore } from "./stores/ui";
import AppHeader from "./layouts/AppHeader.vue";
import RequestDetail from "./components/pages/requests/RequestDetail.vue";

const uiStore = useUIStore();
</script>
