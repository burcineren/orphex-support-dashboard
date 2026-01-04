<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div class="bg-white rounded-lg shadow-sm p-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">
        Requests by Status
      </h3>
      <highcharts :options="statusChartOptions"></highcharts>
    </div>
    <div class="bg-white rounded-lg shadow-sm p-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">
        Requests by Priority
      </h3>
      <highcharts :options="priorityChartOptions"></highcharts>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { Chart as Highcharts } from 'highcharts-vue';
import { useRequestsStore } from '@/stores/requests';

const requestsStore = useRequestsStore();

const statusChartOptions = computed(() => {
  const data = Object.entries(requestsStore.statusCounts).map(([name, y]) => ({
    name,
    y,
  }));

  return {
    chart: { type: 'column' },
    title: { text: null },
    xAxis: {
      type: 'category',
      labels: { style: { fontSize: '12px' } },
    },
    yAxis: {
      min: 0,
      title: { text: 'Number of Requests' },
    },
    legend: { enabled: false },
    series: [
      {
        name: 'Requests',
        data,
        colorByPoint: true,
        colors: ['#3B82F6', '#EAB308', '#F97316', '#10B981'],
      },
    ],
    credits: { enabled: false },
  };
});

const priorityChartOptions = computed(() => {
  const data = Object.entries(requestsStore.priorityCounts).map(
    ([name, y]) => ({ name, y })
  );

  return {
    chart: { type: 'pie' },
    title: { text: null },
    tooltip: {
      pointFormat: '<b>{point.y}</b> requests ({point.percentage:.1f}%)',
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
          enabled: true,
          format: '<b>{point.name}</b>: {point.y}',
        },
      },
    },
    series: [
      {
        name: 'Priority',
        data,
        colors: ['#10B981', '#3B82F6', '#EF4444'],
      },
    ],
    credits: { enabled: false },
  };
});
</script>
