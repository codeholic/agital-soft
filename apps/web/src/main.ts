import { createApp } from 'vue';
import { DefaultApolloClient } from '@vue/apollo-composable';
import { ApolloClient, ApolloLink, InMemoryCache, createHttpLink } from '@apollo/client/core';
import App from './App.vue';
import { router } from './router';
import './style.css';

const authLink = new ApolloLink((operation, forward) => {
  const token = localStorage.getItem('auth_token');
  operation.setContext({ headers: { authorization: token ? `Bearer ${token}` : '' } });
  return forward(operation);
});

const apolloClient = new ApolloClient({
  link: authLink.concat(createHttpLink({ uri: '/graphql' })),
  cache: new InMemoryCache(),
});

const app = createApp(App);
app.provide(DefaultApolloClient, apolloClient);
app.use(router);
app.mount('#app');
