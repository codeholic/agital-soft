<template>
  <div>
    <h2 class="text-xl font-bold text-gray-800 mb-1">
      Suchergebnisse für „{{ q }}"
    </h2>
    <p v-if="!loading && totalCount !== undefined" class="text-sm text-gray-500 mb-6">
      {{ totalCount }} {{ totalCount === 1 ? 'Ergebnis' : 'Ergebnisse' }}
    </p>

    <div v-if="loading" class="text-gray-500">Wird geladen...</div>
    <div v-else-if="error" class="text-red-500">Fehler: {{ error.message }}</div>
    <div v-else-if="!edges.length" class="text-gray-500">Keine Produkte gefunden.</div>
    <template v-else>
      <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        <ProductCard v-for="edge in edges" :key="edge.node.id" :product="edge.node" />
      </div>
      <PaginationBar
        :current-page="page"
        :total-pages="totalPages"
        @change="goToPage"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useQuery } from '@vue/apollo-composable';
import { gql } from '@apollo/client/core';
import ProductCard from '../components/ProductCard.vue';
import PaginationBar from '../components/PaginationBar.vue';

const PAGE_SIZE = 20;

const route = useRoute();
const router = useRouter();

const q = computed(() => (route.query.q as string) ?? '');
const page = computed(() => Math.max(1, Number(route.query.page) || 1));
const inStock = computed(() => route.query.inStock === 'true');

const after = computed((): string | undefined => {
  if (page.value <= 1) return undefined;
  return btoa(String((page.value - 1) * PAGE_SIZE - 1));
});

const filter = computed(() => ({
  search: q.value,
  ...(inStock.value ? { inStock: { eq: true } } : {}),
}));

const SEARCH_QUERY = gql`
  query SearchProducts($filter: ProductFilterInput!, $first: Int!, $after: String) {
    products(first: $first, after: $after, filter: $filter) {
      totalCount
      edges {
        node {
          id name version price listPrice inStock
          images { url alt }
          rating { averageRating reviewCount }
        }
      }
    }
  }
`;

const { result, loading, error } = useQuery(
  SEARCH_QUERY,
  () => ({ filter: filter.value, first: PAGE_SIZE, after: after.value }),
  () => ({ enabled: !!q.value }),
);

const edges = computed(() => result.value?.products?.edges ?? []);
const totalCount = computed(() => result.value?.products?.totalCount);
const totalPages = computed(() =>
  totalCount.value ? Math.ceil(totalCount.value / PAGE_SIZE) : 1,
);

function goToPage(p: number) {
  router.push({ query: { ...route.query, page: p === 1 ? undefined : String(p) } });
}
</script>
