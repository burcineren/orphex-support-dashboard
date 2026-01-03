<template>
  <div class="bg-white border-b border-gray-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Support Requests</h1>
          <p class="text-sm text-gray-500 mt-1">
            {{ filtersStore.filteredCount }} of
            {{ requestsStore.totalCount }} requests
          </p>
        </div>
        <div class="flex gap-2">
          <router-link to="/dashboard" custom v-slot="{ navigate, isActive }">
            <button
              @click="navigate"
              :class="[
                'px-4 py-2 rounded-lg font-medium transition-colors',
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
              ]"
            >
              List View
            </button>
          </router-link>
          <router-link to="/charts" custom v-slot="{ navigate, isActive }">
            <button
              @click="navigate"
              :class="[
                'px-4 py-2 rounded-lg font-medium transition-colors',
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
              ]"
            >
              Charts
            </button>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRequestsStore } from "@/stores/requests";
import { useFiltersStore } from "@/stores/filters";

const requestsStore = useRequestsStore();
const filtersStore = useFiltersStore();
</script>
