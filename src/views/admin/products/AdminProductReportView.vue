<template>
  <h2>Генерація звіту про динаміку змін цін</h2>
  <PButton label="Згенерувати" class="mt-3" @click="handleGenerateReport" />

  <PChart
    v-if="chartData"
    type="line"
    :data="chartData"
    :options="chartOptions"
    class="h-30rem w-full"
  />
  <PButton
    v-if="reportData"
    label="Зберегти у PDF"
    icon="pi pi-download"
    class="mt-3"
    @click="saveToPDF"
  />
</template>

<script setup lang="ts">
import { productsService } from '@/api/products';
import { formatDate } from '@/utilities/formatDate';
import { jsPDF } from 'jspdf';
import { ref } from 'vue';

const reportData = ref();
const chartData = ref();
const chartOptions = ref();

const setChartData = () => {
  const documentStyle = getComputedStyle(document.documentElement);

  return {
    labels: reportData.value.map((item: any) => formatDate(item.createdAt)),
    datasets: [
      {
        label: 'Ціна на "Coca Cola" в "Novus"',
        fill: false,
        borderColor: documentStyle.getPropertyValue('--blue-500'),
        yAxisID: 'y',
        tension: 0.1,
        data: reportData.value.map((item: any) => item.price)
      }
    ]
  };
};

const setChartOptions = () => {
  const documentStyle = getComputedStyle(document.documentElement);

  return {
    responsive: true,
    maintainAspectRatio: false,
    animation: false,
    scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        ticks: {
          color: documentStyle.getPropertyValue('--blue-500')
        }
      }
    }
  };
};

const handleGenerateReport = async () => {
  const result = await productsService.getPriceHistoryReport((5).toString());
  reportData.value = result.filter((_: any, idx: any) => idx % 2 === 0);
  chartData.value = setChartData();
  chartOptions.value = setChartOptions();
};

const saveToPDF = () => {
  const canvas = document.querySelector('.p-chart canvas') as HTMLCanvasElement;
  const ctx = canvas.getContext('2d')!;

  const { width, height } = canvas.getBoundingClientRect();

  const fontSize = 24;
  const textML = 20;
  const textMT = 40;
  const chartML = 20;
  const chartMT = 80;

  const pdf = new jsPDF({
    orientation: width < height ? 'portrait' : 'landscape',
    unit: 'px',
    format: width >= height ? [width + textML + chartML, height + textMT + chartMT] : undefined
  });

  pdf.setFontSize(fontSize);
  pdf.text('Price history report', textML, textMT);

  pdf.addImage(ctx.canvas.toDataURL('image/png'), 'PNG', chartML, chartMT, width, height);
  pdf.save('price-history-report.pdf');
};
</script>

<style scoped lang="scss">
#prices {
  width: 400px;
  height: 300px;
}
</style>
