<template>
  <div class="relative" ref="containerRef">
    <!-- Logged in: user chip -->
    <button
      v-if="isLoggedIn"
      @click="open = !open"
      class="flex items-center gap-2 h-10 text-sm font-medium text-gray-700 hover:text-gray-900"
    >
      <span class="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center">
        <i class="fa-solid fa-user text-sm"></i>
      </span>
      <span class="hidden sm:block">{{ user?.name }}</span>
    </button>

    <!-- Not logged in: login button -->
    <button
      v-else
      @click="open = !open"
      class="h-10 text-base font-semibold text-white bg-gray-900 hover:bg-gray-700 rounded-lg px-5 transition-colors"
    >
      Anmelden
    </button>

    <!-- Dropdown -->
    <div
      v-if="open"
      class="absolute right-0 top-full mt-2 z-50 bg-white rounded-xl shadow-lg border border-gray-200 w-72"
    >
      <!-- Logged in: profile + logout -->
      <template v-if="isLoggedIn">
        <div class="px-4 py-3 border-b border-gray-100">
          <p class="font-semibold text-gray-900 text-sm">{{ user?.name }}</p>
          <p class="text-xs text-gray-500 mt-0.5">{{ user?.email }}</p>
        </div>
        <div class="p-2">
          <button
            @click="handleLogout"
            class="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            Abmelden
          </button>
        </div>
      </template>

      <!-- Not logged in: login form -->
      <template v-else>
        <form @submit.prevent="handleLogin" class="p-4 flex flex-col gap-3">
          <h3 class="font-semibold text-gray-900 text-sm">Anmelden</h3>
          <div>
            <label class="block text-xs font-medium text-gray-600 mb-1">E-Mail</label>
            <input
              v-model="email"
              type="email"
              required
              autocomplete="email"
              class="w-full rounded-lg border-gray-300 text-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-600 mb-1">Passwort</label>
            <input
              v-model="password"
              type="password"
              required
              autocomplete="current-password"
              class="w-full rounded-lg border-gray-300 text-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <p v-if="errorMsg" class="text-xs text-red-600">{{ errorMsg }}</p>
          <button
            type="submit"
            :disabled="loading"
            class="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-semibold py-2 rounded-lg transition-colors"
          >
            {{ loading ? 'Wird angemeldet…' : 'Anmelden' }}
          </button>
        </form>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useMutation } from '@vue/apollo-composable';
import { gql } from '@apollo/client/core';
import { useAuth } from '../composables/useAuth';

const { user, isLoggedIn, setAuth, logout } = useAuth();

const open = ref(false);
const email = ref('');
const password = ref('');
const errorMsg = ref('');
const containerRef = ref<HTMLElement | null>(null);

const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user { id name email }
    }
  }
`;

const { mutate, loading } = useMutation(LOGIN_MUTATION);

async function handleLogin() {
  errorMsg.value = '';
  const result = await mutate({ email: email.value, password: password.value });
  if (result?.data?.login) {
    setAuth(result.data.login.token, result.data.login.user);
    open.value = false;
    email.value = '';
    password.value = '';
  } else {
    errorMsg.value = 'Ungültige Anmeldedaten';
  }
}

function handleLogout() {
  logout();
  open.value = false;
}

function onClickOutside(e: MouseEvent) {
  if (containerRef.value && !containerRef.value.contains(e.target as Node)) {
    open.value = false;
  }
}

onMounted(() => document.addEventListener('mousedown', onClickOutside));
onUnmounted(() => document.removeEventListener('mousedown', onClickOutside));
</script>
