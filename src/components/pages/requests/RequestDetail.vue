<template>
  <div
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    style="backdrop-filter: blur(4px)"
  >
    <div
      class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
    >
      <div
        class="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center"
      >
        <h2 class="text-xl font-bold text-gray-900">{{ request?.id }}</h2>
        <button
          @click="uiStore.closeDetail"
          class="text-gray-400 hover:text-gray-600"
        >
          <X />
        </button>
      </div>

      <div v-if="request" class="p-6 space-y-6">
        <div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">
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
            rows="3"
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
          <h4 class="font-medium text-gray-900 mb-2">Comments</h4>
          <div class="space-y-2">
            <div
              v-for="(comment, i) in request.comments"
              :key="i"
              class="bg-gray-50 p-3 rounded"
            >
              <p class="text-sm text-gray-900">{{ comment.text }}</p>
              <p class="text-xs text-gray-500 mt-1">
                {{ formatDateTime(comment.date) }}
              </p>
            </div>
          </div>
        </div>

        <div class="flex justify-end gap-3 pt-4 border-t">
          <button
            @click="uiStore.closeDetail"
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
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useRequestsStore } from '@/stores/requests';
import { useUIStore } from '@/stores/ui';
import { X } from 'lucide-vue-next';

const requestsStore = useRequestsStore();
const uiStore = useUIStore();

const editStatus = ref('');
const editPriority = ref('');
const newComment = ref('');

const request = computed(() => {
  return requestsStore.getRequestById(uiStore.selectedRequestId);
});

// Initialize edit values when request changes
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
  requestsStore.updateRequest(uiStore.selectedRequestId, {
    status: editStatus.value,
    priority: editPriority.value,
  });
  uiStore.closeDetail();
};

const handleAddComment = () => {
  if (newComment.value.trim()) {
    requestsStore.addComment(uiStore.selectedRequestId, newComment.value);
    newComment.value = '';
  }
};

const formatDateTime = (dateString) => {
  return new Date(dateString).toLocaleString();
};
</script>
