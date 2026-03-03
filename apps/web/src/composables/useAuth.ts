import { computed, ref } from 'vue';

interface AuthUser {
  id: string;
  name: string;
  email: string;
}

const token = ref<string | null>(localStorage.getItem('auth_token'));
const user = ref<AuthUser | null>(JSON.parse(localStorage.getItem('auth_user') ?? 'null'));

export function useAuth() {
  const isLoggedIn = computed(() => !!token.value);

  function setAuth(newToken: string, newUser: AuthUser) {
    token.value = newToken;
    user.value = newUser;
    localStorage.setItem('auth_token', newToken);
    localStorage.setItem('auth_user', JSON.stringify(newUser));
  }

  function logout() {
    token.value = null;
    user.value = null;
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
  }

  return { token, user, isLoggedIn, setAuth, logout };
}
