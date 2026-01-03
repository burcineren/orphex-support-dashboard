<template>
  <div class="bg-white rounded-lg shadow-sm">
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
            v-model="editableStatus"
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
            v-model="editablePriority"
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
          @click="onAddComment"
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
          @click="$emit('cancel')"
          class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          @click="onSave"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Save Changes
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  request: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["save", "add-comment", "cancel"]);

const editableStatus = ref("");
const editablePriority = ref("");
const newComment = ref("");

watch(
  () => props.request,
  (newRequest) => {
    if (newRequest) {
      editableStatus.value = newRequest.status;
      editablePriority.value = newRequest.priority;
    }
  },
  { immediate: true }
);

const onSave = () => {
  emit("save", {
    status: editableStatus.value,
    priority: editablePriority.value,
  });
};

const onAddComment = () => {
  if (newComment.value.trim()) {
    emit("add-comment", newComment.value);
    newComment.value = "";
  }
};

const formatDateTime = (dateString) => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleString();
};
</script>
