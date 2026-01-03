<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center">
    <div class="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
      <div
        class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4"
      >
        <AlertTriangle class="h-6 w-6 text-red-600" />
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
          <RefreshCw class="h-4 w-4" />
          Try Again
        </span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { AlertTriangle, RefreshCw } from "lucide-vue-next";

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
