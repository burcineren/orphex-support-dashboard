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
      <div v-else class="bg-white rounded-lg shadow-sm">
        <div class="border-b border-gray-200 px-6 py-4">
          <h2 class="text-2xl font-bold text-gray-900">{{ request.id }}</h2>
        </div>

        <div class="p-6 space-y-6">
          <div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">
              {{ request.title }}
            </h3>
            <p class="text-gray-600">Customer: {{ request.customer }}</p>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >Status</label
              >
              <select
                v-model="editStatus"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option>New</option>
                <option>In Progress</option>
                <option>Waiting on Customer</option>
                <option>Done</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >Priority</label
              >
              <select
                v-model="editPriority"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
            </div>
          </div>

          <div class="flex gap-3">
            <span
              v-for="(tag, i) in request.tags"
              :key="i"
              class="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
            >
              {{ tag }}
            </span>
          </div>

          <div class="border-t pt-4">
            <p class="text-sm text-gray-600">
              Created: {{ formatDateTime(request.createdAt) }}
            </p>
            <p class="text-sm text-gray-600">
              Updated: {{ formatDateTime(request.updatedAt) }}
            </p>
            <p v-if="request.lastCommentAt" class="text-sm text-gray-600">
              Last Comment: {{ formatDateTime(request.lastCommentAt) }}
            </p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >Add Internal Comment</label
            >
            <textarea
              v-model="newComment"
              placeholder="Type your comment..."
              rows="4"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            ></textarea>
            <button
              @click="handleAddComment"
              class="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Add Comment
            </button>
          </div>

          <div v-if="request.comments && request.comments.length > 0">
            <h4 class="font-medium text-gray-900 mb-3">Comments History</h4>
            <div class="space-y-3">
              <div
                v-for="(comment, i) in request.comments"
                :key="i"
                class="bg-gray-50 p-4 rounded-lg"
              >
                <p class="text-sm text-gray-900">{{ comment.text }}</p>
                <p class="text-xs text-gray-500 mt-2">
                  {{ formatDateTime(comment.date) }}
                </p>
              </div>
            </div>
          </div>

          <div class="flex justify-end gap-3 pt-4 border-t">
            <button
              @click="router.back()"
              class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              @click="handleSave"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useRequestsStore } from "../stores/requests";
import { ArrowLeft, AlertTriangle } from "lucide-vue-next";

const router = useRouter();
const route = useRoute();
const requestsStore = useRequestsStore();

const props = defineProps({
  id: String,
});

const editStatus = ref("");
const editPriority = ref("");
const newComment = ref("");

const request = computed(() => {
  return requestsStore.getRequestById(props.id || route.params.id);
});

watch(
  request,
  (newRequest) => {
    if (newRequest) {
      editStatus.value = newRequest.status;
      editPriority.value = newRequest.priority;
    }
  },
  { immediate: true }
);

const handleSave = () => {
  requestsStore.updateRequest(props.id || route.params.id, {
    status: editStatus.value,
    priority: editPriority.value,
  });
  router.back();
};

const handleAddComment = () => {
  if (newComment.value.trim()) {
    requestsStore.addComment(props.id || route.params.id, newComment.value);
    newComment.value = "";
  }
};

const formatDateTime = (dateString) => {
  return new Date(dateString).toLocaleString();
};
</script>
