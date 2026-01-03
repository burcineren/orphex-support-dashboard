<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Back Button -->
      <button
        @click="router.back()"
        class="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft class="h-5 w-5" />
        Back to Dashboard
      </button>

      <!-- Request Not Found -->
      <div
        v-if="!request"
        class="bg-white rounded-lg shadow-sm p-8 text-center"
      >
        <AlertTriangle class="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h2 class="text-xl font-semibold text-gray-900 mb-2">
          Request Not Found
        </h2>
        <p class="text-gray-600 mb-4">
          The request you're looking for doesn't exist.
        </p>
        <button
          @click="router.push('/')"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Go to Dashboard
        </button>
      </div>

      <!-- Request Detail Card -->
      <!-- <RequestDetailCard
        v-else
        :request="request"
        @save="handleSave"
        @add-comment="handleAddComment"
        @cancel="router.back()"
      /> -->
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useRequestsStore } from "@/stores/requests";
import { ArrowLeft, AlertTriangle } from "lucide-vue-next";
import RequestDetailCard from "@/components/pages/requests/RequestDetailCard.vue";

const router = useRouter();
const route = useRoute();
const requestsStore = useRequestsStore();

const props = defineProps({
  id: String,
});

const requestId = computed(() => props.id || route.params.id);

const request = computed(() => {
  return requestsStore.getRequestById(requestId.value);
});

const handleSave = (updates) => {
  requestsStore.updateRequest(requestId.value, updates);
  router.back();
};

const handleAddComment = (comment) => {
  requestsStore.addComment(requestId.value, comment);
};
</script>
