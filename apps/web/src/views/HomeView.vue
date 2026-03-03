<template>
  <div>
    <!-- Search results -->
    <template v-if="searchQuery">
      <h2 class="text-xl font-bold text-gray-800 mb-4">
        Suchergebnisse für „{{ searchQuery }}"
      </h2>
      <div v-if="searchLoading" class="text-gray-500">Wird geladen...</div>
      <div v-else-if="searchError" class="text-red-500">Fehler: {{ searchError.message }}</div>
      <div v-else-if="!searchEdges.length" class="text-gray-500">Keine Produkte gefunden.</div>
      <div v-else class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        <ProductCard v-for="edge in searchEdges" :key="edge.node.id" :product="edge.node" />
      </div>
    </template>

    <!-- Home lists -->
    <template v-else>
      <div v-if="homeLoading" class="text-gray-500">Wird geladen...</div>
      <div v-else-if="homeError" class="text-red-500">Fehler: {{ homeError.message }}</div>
      <template v-else>
        <section class="mb-12">
          <h2 class="text-xl font-bold text-gray-800 mb-4">Neueste Produkte</h2>
          <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            <ProductCard
              v-for="edge in newestEdges"
              :key="edge.node.id"
              :product="edge.node"
            />
          </div>
        </section>
        <section>
          <h2 class="text-xl font-bold text-gray-800 mb-4">Bestbewertet</h2>
          <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            <ProductCard
              v-for="edge in topRatedEdges"
              :key="edge.node.id"
              :product="edge.node"
            />
          </div>
        </section>
      </template>
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
const searchQuery = computed(() => route.query.q as string | undefined);

const HOME_QUERY = gql`
  query HomeProducts {
    newest: products(first: 10, sort: [{ createdAt: DESC }]) {
      edges {
        node {
          id name version price listPrice inStock
          images { url alt }
          rating { averageRating reviewCount }
        }
      }
    }
    topRated: products(first: 10, sort: [{ averageRating: DESC }]) {
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

const SEARCH_QUERY = gql`
  query SearchProducts($search: String!) {
    products(first: 20, filter: { search: $search }) {
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

const {
  result: homeResult,
  loading: homeLoading,
  error: homeError,
} = useQuery(HOME_QUERY, undefined, () => ({ enabled: !searchQuery.value }));

const {
  result: searchResult,
  loading: searchLoading,
  error: searchError,
} = useQuery(SEARCH_QUERY, () => ({ search: searchQuery.value ?? '' }), () => ({
  enabled: !!searchQuery.value,
}));

const newestEdges = computed(() => homeResult.value?.newest?.edges ?? []);
const topRatedEdges = computed(() => homeResult.value?.topRated?.edges ?? []);
const searchEdges = computed(() => searchResult.value?.products?.edges ?? []);
</script>
