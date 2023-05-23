<template>
  <h2>Динаміка змін цін на продукт #{{ productId }}</h2>
  <PDropdown
    v-model="selectedReportOption"
    :options="reportOptions"
    option-label="label"
    option-value="value"
    class="mt-3 w-12rem"
    @change="handleReportOptionChange"
  />

  <PProgressSpinner v-if="isLoading" />
  <div v-els class="flex flex-column align-items-start gap-3">
    <PChart type="line" :data="chartData" :options="chartOptions" class="h-30rem w-full" />
    <PButton label="Зберегти у PDF" icon="pi pi-file-export" @click="saveToPDF" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import type { ReportOption, PriceHistoryItem } from '@/api/types/product';
import { productsService } from '@/api/products';
import { formatDate } from '@/utilities/formatDate';
import { jsPDF } from 'jspdf';
import { useToast } from 'primevue/usetoast';
import { useRoute, useRouter } from 'vue-router';

const toast = useToast();
const route = useRoute();
const router = useRouter();
const isLoading = ref(false);

const reportOptions = ref([
  { label: 'За тиждень', value: 'week' },
  { label: 'За місяць', value: 'month' },
  { label: 'За рік', value: 'year' }
]);
const selectedReportOption = ref<ReportOption>('week');

const productId = route.params.id;
const product = ref<{ id: number; title: string } | null>(null);
const shop = ref<{ id: number; title: string } | null>(null);

const reportData = ref<PriceHistoryItem[]>([]);
const chartData = ref();
const chartOptions = ref();

const setChartData = () => {
  const documentStyle = getComputedStyle(document.documentElement);

  return {
    labels: reportData.value.map((item: any) => formatDate(item.createdAt)),
    datasets: [
      {
        label: `Ціна на "${product.value!.title}" в "${shop.value!.title}"`,
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
    scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        beginAtZero: true,
        ticks: {
          color: documentStyle.getPropertyValue('--blue-500')
        }
      }
    }
  };
};

const getPriceHistory = async () => {
  try {
    isLoading.value = true;

    const result = await productsService.getPriceHistoryReport(
      productId.toString(),
      selectedReportOption.value
    );

    product.value = result.product;
    shop.value = result.shop;
    reportData.value = result.priceHistory;
    chartData.value = setChartData();
    chartOptions.value = setChartOptions();
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Помилка',
      detail: `Не вдалося отримати історію змін цін для продукту #{productId}`,
      life: 3000
    });
    router.push({ name: 'adminProducts' });
  } finally {
    isLoading.value = false;
  }
};

const handleReportOptionChange = () => getPriceHistory();

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

onMounted(getPriceHistory);
</script>

<style scoped lang="scss">
#prices {
  width: 400px;
  height: 300px;
}
</style>
