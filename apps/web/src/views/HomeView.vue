<template>
  <div>
    <div v-if="loading" class="text-gray-500">Wird geladen...</div>
    <div v-else-if="error" class="text-red-500">Fehler: {{ error.message }}</div>
    <template v-else>
      <section class="mb-12">
        <h2 class="text-xl font-bold text-gray-800 mb-4">Neueste Produkte</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          <ProductCard v-for="edge in newestEdges" :key="edge.node.id" :product="edge.node" />
        </div>
      </section>
      <section>
        <h2 class="text-xl font-bold text-gray-800 mb-4">Bestbewertet</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          <ProductCard v-for="edge in topRatedEdges" :key="edge.node.id" :product="edge.node" />
        </div>
      </section>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useQuery } from '@vue/apollo-composable';
import { gql } from '@apollo/client/core';
import ProductCard from '../components/ProductCard.vue';

const route = useRoute();
const inStock = computed(() => route.query.inStock === 'true');
const filter = computed(() => inStock.value ? { inStock: { eq: true } } : undefined);

const HOME_QUERY = gql`
  query HomeProducts($filter: ProductFilterInput) {
    newest: products(first: 10, sort: [{ createdAt: DESC }], filter: $filter) {
      edges { node { id name version price listPrice inStock images { url alt } rating { averageRating reviewCount } } }
    }
    topRated: products(first: 10, sort: [{ averageRating: DESC }], filter: $filter) {
      edges { node { id name version price listPrice inStock images { url alt } rating { averageRating reviewCount } } }
    }
  }
`;

const { result, loading, error } = useQuery(HOME_QUERY, () => ({ filter: filter.value }));

const newestEdges = computed(() => result.value?.newest?.edges ?? []);
const topRatedEdges = computed(() => result.value?.topRated?.edges ?? []);
</script>
