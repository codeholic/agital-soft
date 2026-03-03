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
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import LoginDropdown from './components/LoginDropdown.vue';

const router = useRouter();
const searchQuery = ref('');

function submitSearch() {
  if (searchQuery.value.trim()) {
    router.push({ path: '/', query: { q: searchQuery.value.trim() } });
  } else {
    router.push('/');
  }
}
</script>
