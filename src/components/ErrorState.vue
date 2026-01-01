<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center">
    <div class="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
      <div
        class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4"
      >
        <svg
          class="h-6 w-6 text-red-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          ></path>
        </svg>
      </div>

      <h2 class="text-xl font-bold text-gray-900 mb-2">
        {{ title }}
      </h2>

      <p class="text-gray-600 mb-6">
        {{ message }}
      </p>

      <button
        @click="$emit('retry')"
        class="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
      >
        <span class="flex items-center justify-center gap-2">
          <svg
            class="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            ></path>
          </svg>
          Try Again
        </span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  error: {
    type: String,
    default: null,
  },
});

defineEmits(["retry"]);

const title = computed(() => {
  return "Something went wrong";
});

const message = computed(() => {
  return props.error || "Failed to load data. Please try again.";
});
</script>
