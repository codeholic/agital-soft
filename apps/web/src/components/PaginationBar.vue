<template>
  <div v-if="totalPages > 1" class="flex items-center justify-center gap-1 mt-8">
    <template v-for="(item, i) in pages" :key="typeof item === 'number' ? item : `ellipsis-${i}`">
      <span v-if="item === '...'" class="px-2 py-1.5 text-sm text-gray-400 select-none">…</span>
      <button
        v-else
        @click="$emit('change', item)"
        :class="[
          'min-w-[2rem] px-2 py-1.5 rounded text-sm font-medium transition-colors',
          item === currentPage
            ? 'bg-indigo-600 text-white'
            : 'text-gray-700 hover:bg-gray-100',
        ]"
      >
        {{ item }}
      </button>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{ currentPage: number; totalPages: number }>();
defineEmits<{ change: [page: number] }>();

const pages = computed((): (number | '...')[] => {
  const { currentPage: cur, totalPages: total } = props;

  const around = new Set(
    [1, total, cur - 1, cur, cur + 1].filter((p) => p >= 1 && p <= total),
  );
  const sorted = [...around].sort((a, b) => a - b);

  const result: (number | '...')[] = [];
  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i] - sorted[i - 1] > 1) result.push('...');
    result.push(sorted[i]);
  }
  return result;
});
</script>
