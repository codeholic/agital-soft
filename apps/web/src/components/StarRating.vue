<template>
  <span class="flex items-center gap-0.5">
    <i v-for="(state, i) in starStates" :key="i"
      :class="{
        'fa-solid fa-star text-yellow-400':         state === 'full',
        'fa-solid fa-star-half-stroke text-yellow-400': state === 'half',
        'fa-regular fa-star text-gray-300':         state === 'empty',
      }"
    ></i>
    <span v-if="count !== undefined" class="text-xs text-gray-500 ml-1">{{ rating.toFixed(1) }} ({{ count }})</span>
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  rating: number;
  count?: number;
}>();

const starStates = computed(() => {
  const frac = props.rating % 1;
  const full = frac >= 0.8 ? Math.ceil(props.rating) : Math.floor(props.rating);
  const half = frac >= 0.3 && frac < 0.8;
  return Array.from({ length: 5 }, (_, i) => {
    if (i + 1 <= full) return 'full';
    if (i + 1 === full + 1 && half) return 'half';
    return 'empty';
  });
});
</script>
