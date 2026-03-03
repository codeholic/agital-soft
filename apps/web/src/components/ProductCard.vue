<template>
  <RouterLink
    :to="`/product/${product.id}`"
    class="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col"
  >
    <div class="aspect-square bg-gray-100 overflow-hidden">
      <img
        v-if="product.images && product.images.length"
        :src="product.images[0].url"
        :alt="product.images[0].alt || product.name"
        class="w-full h-full object-cover"
      />
      <div v-else class="w-full h-full flex items-center justify-center text-gray-400 text-sm">
        Kein Bild
      </div>
    </div>
    <div class="p-3 flex flex-col gap-1 flex-1">
      <p class="text-xs text-gray-500 truncate">{{ product.version }}</p>
      <h3 class="font-semibold text-gray-900 text-sm leading-tight line-clamp-2">
        {{ product.name }}
      </h3>
      <StarRating
        v-if="product.rating"
        :rating="product.rating.averageRating"
        :count="product.rating.reviewCount"
      />
      <div class="mt-auto pt-2 flex items-baseline gap-2">
        <span class="font-bold text-gray-900">{{ formatPrice(product.price) }}</span>
        <span v-if="product.listPrice" class="text-xs text-gray-400 line-through">
          {{ formatPrice(product.listPrice) }}
        </span>
      </div>
      <span
        v-if="!product.inStock"
        class="text-xs text-red-500 font-medium"
      >
        Nicht vorrätig
      </span>
    </div>
  </RouterLink>
</template>

<script setup lang="ts">
import StarRating from './StarRating.vue';

defineProps<{
  product: {
    id: string;
    name: string;
    version: string;
    price: number;
    listPrice?: number | null;
    inStock: boolean;
    images?: Array<{ url: string; alt?: string | null }> | null;
    rating?: { averageRating: number; reviewCount: number } | null;
  };
}>();

function formatPrice(price: number): string {
  return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(price);
}
</script>
