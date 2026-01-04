import { ref, computed, watch } from 'vue';

export function usePagination(sourceData, pageSize = 10) {
  const currentPage = ref(1);
  const internalPageSize = ref(pageSize);

  const totalPages = computed(() =>
    Math.ceil(sourceData.value.length / internalPageSize.value)
  );

  const paginatedData = computed(() => {
    const start = (currentPage.value - 1) * internalPageSize.value;
    const end = start + internalPageSize.value;
    return sourceData.value.slice(start, end);
  });

  const hasNextPage = computed(() => currentPage.value < totalPages.value);
  const hasPrevPage = computed(() => currentPage.value > 1);

  const nextPage = () => {
    if (hasNextPage.value) {
      currentPage.value++;
    }
  };

  const prevPage = () => {
    if (hasPrevPage.value) {
      currentPage.value--;
    }
  };

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page;
    }
  };

  watch(sourceData, () => {
    if (currentPage.value > totalPages.value) {
      currentPage.value = totalPages.value || 1;
    }
  });

  return {
    currentPage,
    pageSize: internalPageSize,
    totalPages,
    paginatedData,
    hasNextPage,
    hasPrevPage,
    nextPage,
    prevPage,
    goToPage,
  };
}
