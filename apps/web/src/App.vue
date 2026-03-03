<template>
  <div class="min-h-screen bg-gray-50">
    <header class="bg-white shadow-sm sticky top-0 z-10">
      <div class="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
        <RouterLink to="/" class="text-2xl font-bold text-gray-900 shrink-0">
          agital.soft GmbH
        </RouterLink>
        <form class="flex-1 max-w-lg" @submit.prevent="submitSearch">
          <input
            v-model="searchQuery"
            type="search"
            placeholder="Produkte suchen..."
            class="w-full rounded-lg border-gray-300 shadow-sm text-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </form>
        <label class="flex items-center gap-2 text-sm text-gray-600 shrink-0 cursor-pointer select-none">
          <input
            type="checkbox"
            :checked="inStock"
            @change="toggleInStock"
            class="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
          Verfügbar
        </label>
        <div class="ml-auto shrink-0">
          <LoginDropdown />
        </div>
      </div>
    </header>
    <main class="max-w-7xl mx-auto px-4 py-8">
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import LoginDropdown from './components/LoginDropdown.vue';

const router = useRouter();
const route = useRoute();
const searchQuery = ref('');

const inStock = computed(() => route.query.inStock === 'true');

function toggleInStock(e: Event) {
  const checked = (e.target as HTMLInputElement).checked;
  const query = { ...route.query };
  if (checked) {
    query.inStock = 'true';
  } else {
    delete query.inStock;
  }
  delete query.page;
  router.replace({ query });
}

function submitSearch() {
  const query: Record<string, string> = {};
  if (searchQuery.value.trim()) query.q = searchQuery.value.trim();
  if (inStock.value) query.inStock = 'true';
  router.push({ path: '/search', query });
}
</script>
