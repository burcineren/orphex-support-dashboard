import { defineStore } from "pinia";
import { useSupportData } from "@/composables/useSupportData.js";

export const useSupportStore = defineStore("support", () => {
  const {
    requests,
    needsAttentionCount,
    regenerateData,
    STATUSES,
    PRIORITIES,
  } = useSupportData(25, 123);

  const addRequest = (request) => {
    // Add implementation
  };

  const updateRequest = (id, updates) => {
    // Update implementation
  };

  return {
    requests,
    needsAttentionCount,
    regenerateData,
    addRequest,
    updateRequest,
    STATUSES,
    PRIORITIES,
  };
});
