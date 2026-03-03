<template>
  <span class="flex items-center gap-0.5">
    <template v-for="i in 5" :key="i">
      <i
        :class="i <= fullStars ? 'fa-solid fa-star text-yellow-400' : 'fa-regular fa-star text-gray-300'"
      ></i>
    </template>
    <span v-if="count !== undefined" class="text-xs text-gray-500 ml-1">({{ count }})</span>
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  rating: number;
  count?: number;
}>();

const fullStars = computed(() => Math.round(props.rating));
</script>
