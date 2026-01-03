<template>
  <div class="bg-white rounded-lg shadow-sm p-4 mb-6">
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <!-- Search -->
      <div class="relative">
        <Search
          class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
        />
        <input
          :value="filtersStore.searchTerm"
          @input="filtersStore.setSearch($event.target.value)"
          type="text"
          placeholder="Search by title, customer or ID..."
          class="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        />
      </div>

      <!-- Status Filter -->
      <select
        :value="filtersStore.statusFilter"
        @change="filtersStore.setStatusFilter($event.target.value)"
        class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        <option value="All">All Statuses</option>
        <option value="New">New</option>
        <option value="In Progress">In Progress</option>
        <option value="Waiting on Customer">Waiting on Customer</option>
        <option value="Done">Done</option>
      </select>

      <!-- Priority Filter -->
      <select
        :value="filtersStore.priorityFilter"
        @change="filtersStore.setPriorityFilter($event.target.value)"
        class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        <option value="All">All Priorities</option>
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
      </select>

      <!-- Export CSV -->
      <button
        @click="filtersStore.exportCSV"
        class="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors"
        :disabled="!filtersStore.filteredCount"
      >
        <Download class="w-4 h-4" />
        Export {{ filtersStore.filteredCount }} CSV
      </button>
    </div>

    <!-- Advanced Filters -->
    <div class="mt-4 pt-4 border-t border-gray-200">
      <div class="flex flex-wrap items-center gap-6">
        <!-- Needs Attention Filter -->
        <label class="flex items-center gap-2 cursor-pointer group">
          <input
            :checked="filtersStore.showNeedsAttention"
            @change="filtersStore.toggleNeedsAttention()"
            type="checkbox"
            class="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 border-gray-300"
          />
          <span
            class="text-sm font-medium text-gray-700 flex items-center gap-1 group-hover:text-blue-600 transition-colors"
          >
            <AlertTriangle class="w-4 h-4" />
            Needs Attention Only ({{
              requestsStore.needsAttentionRequests.length
            }})
          </span>
        </label>

        <!-- Sort Order -->
        <div class="flex items-center gap-1 text-sm text-gray-600">
          <span>Sort:</span>
          <select
            :value="filtersStore.sortOrder"
            @change="filtersStore.setSortOrder($event.target.value)"
            class="px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>

        <!-- Active Filters Badge -->
        <div
          v-if="filtersStore.hasActiveFilters"
          class="flex items-center gap-2"
        >
          <span
            class="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium"
          >
            {{ filtersStore.activeFiltersCount }} filters
          </span>

          <!-- Clear Filters Button -->
          <button
            @click="filtersStore.resetFilters"
            class="text-sm text-red-600 hover:text-red-700 font-medium hover:underline transition-colors"
          >
            Clear All
          </button>
        </div>

        <!-- Results Count -->
        <div class="ml-auto text-sm text-gray-600 font-medium">
          {{ filtersStore.filteredCount }} of
          {{ requestsStore.totalCount }} requests
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useFiltersStore } from "../stores/filters.js";
import { useRequestsStore } from "../stores/requests.js";
import { Search, Download, AlertTriangle } from "lucide-vue-next";

const filtersStore = useFiltersStore();
const requestsStore = useRequestsStore();
</script>
