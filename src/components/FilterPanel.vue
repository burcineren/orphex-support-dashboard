<template>
  <div class="bg-white rounded-lg shadow-sm p-4 mb-6">
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div class="relative">
        <SearchIcon />
        <input
          :value="search"
          @input="$emit('update:search', $event.target.value)"
          type="text"
          placeholder="Search by title or customer..."
          class="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <select
        :value="status"
        @change="$emit('update:status', $event.target.value)"
        class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        <option value="All">All Statuses</option>
        <option value="New">New</option>
        <option value="In Progress">In Progress</option>
        <option value="Waiting on Customer">Waiting on Customer</option>
        <option value="Done">Done</option>
      </select>

      <select
        :value="sort"
        @change="$emit('update:sort', $event.target.value)"
        class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        <option value="newest">Newest First</option>
        <option value="oldest">Oldest First</option>
      </select>

      <button
        @click="$emit('export')"
        class="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
      >
        <DownloadIcon />
        Export CSV
      </button>
    </div>

    <div class="mt-3 flex items-center">
      <label class="flex items-center gap-2 cursor-pointer">
        <input
          :checked="needsAttention"
          @change="$emit('update:needsAttention', $event.target.checked)"
          type="checkbox"
          class="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
        />
        <span class="text-sm font-medium text-gray-700 flex items-center gap-1">
          <AlertIcon />
          Show only "Needs Attention"
        </span>
      </label>
    </div>
  </div>
</template>

<script setup>
import SearchIcon from "./icons/SearchIcon.vue";
import DownloadIcon from "./icons/DownloadIcon.vue";
import AlertIcon from "./icons/AlertIcon.vue";

defineProps({
  search: String,
  status: String,
  sort: String,
  needsAttention: Boolean,
});

defineEmits([
  "update:search",
  "update:status",
  "update:sort",
  "update:needsAttention",
  "export",
]);
</script>
