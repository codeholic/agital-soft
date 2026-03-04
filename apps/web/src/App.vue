<template>
  <div class="min-h-screen bg-gray-50">
    <header class="bg-white shadow-sm sticky top-0 z-10">
      <div class="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
        <RouterLink to="/" class="text-2xl font-bold text-gray-900 shrink-0">
          agital.soft GmbH
        </RouterLink>

        <!-- Desktop search -->
        <form class="hidden sm:flex flex-1 max-w-lg gap-2" @submit.prevent="submitSearch">
          <input
            v-model="searchQuery"
            type="search"
            placeholder="Produkte suchen..."
            class="flex-1 rounded-lg border-gray-300 shadow-sm text-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
          <label class="flex items-center gap-2 text-sm text-gray-600 shrink-0 cursor-pointer select-none">
            <input
              type="checkbox"
              v-model="inStock"
              class="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            Verfügbar
          </label>
          <button
            type="submit"
            class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors shrink-0"
          >
            Suchen
          </button>
        </form>

        <div class="ml-auto flex items-center gap-2 shrink-0">
          <!-- Mobile search toggle -->
          <button
            class="sm:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
            @click="searchOpen = !searchOpen"
            aria-label="Suche"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
          </button>
          <LoginDropdown />
        </div>
      </div>

      <!-- Mobile search drawer -->
      <div v-if="searchOpen" class="sm:hidden border-t border-gray-100 px-4 py-3">
        <form class="flex flex-col gap-2" @submit.prevent="submitSearch">
          <input
            v-model="searchQuery"
            type="search"
            placeholder="Produkte suchen..."
            autofocus
            class="w-full rounded-lg border-gray-300 shadow-sm text-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
          <div class="flex items-center justify-between gap-2">
            <label class="flex items-center gap-2 text-sm text-gray-600 cursor-pointer select-none">
              <input
                type="checkbox"
                v-model="inStock"
                class="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              Verfügbar
            </label>
            <button
              type="submit"
              class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors"
            >
              Suchen
            </button>
          </div>
        </form>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-4 py-8">
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import LoginDropdown from './components/LoginDropdown.vue';

const router = useRouter();
const route = useRoute();
const searchQuery = ref('');
const inStock = ref(false);
const searchOpen = ref(false);

watch(() => route.query.q, (q) => {
  searchQuery.value = typeof q === 'string' ? q : '';
}, { immediate: true });

function submitSearch() {
  const query: Record<string, string> = {};
  if (searchQuery.value.trim()) query.q = searchQuery.value.trim();
  if (inStock.value) query.inStock = 'true';
  searchOpen.value = false;
  router.push({ path: '/search', query });
}
</script>
