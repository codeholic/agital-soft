import { createApp } from 'vue';
import { DefaultApolloClient } from '@vue/apollo-composable';
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client/core';
import App from './App.vue';
import { router } from './router';
import './style.css';

const apolloClient = new ApolloClient({
  link: createHttpLink({ uri: '/graphql' }),
  cache: new InMemoryCache(),
});

const app = createApp(App);
app.provide(DefaultApolloClient, apolloClient);
app.use(router);
app.mount('#app');
