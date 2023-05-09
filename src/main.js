import App from './App.vue'
import { ApolloClient, createHttpLink, InMemoryCache, split } from '@apollo/client/core'
import { createApolloProvider } from '@vue/apollo-option'
import { createApp, h } from 'vue'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import { WebSocketLink } from '@apollo/client/link/ws'
import { createClient } from 'graphql-ws'
import VueApolloComponents from '@vue/apollo-components'
import './assets/main.css'
import { getMainDefinition } from '@apollo/client/utilities'

// HTTP connection to the API
const httpLink = createHttpLink({
  // You should use an absolute URL here
  uri: 'https://localhost:7217/graphql',
})

// Create the subscription websocket link
const wsLink = new GraphQLWsLink(createClient({
  url: 'ws://localhost:7217/graphql'}))

const wsLink2 = new WebSocketLink({
  uri: 'wss://localhost:7217/graphql',
  options: {
    reconnect: true,
  }
  })

const link = split(
  ({query}) => {
    const definition = getMainDefinition(query);
    return definition.kind === 'OperationDefinition' && definition.operation === 'subscription'
  },
  wsLink2,
  httpLink
)

// Cache implementation
const cache = new InMemoryCache()

// Create the apollo client
const apolloClient = new ApolloClient({
  link: link,
  cache,
})

const apolloProvider = createApolloProvider({
  defaultClient: apolloClient,
})

const app = createApp({
  render: () => h(App),
})

app.use(apolloProvider)
app.use(VueApolloComponents)

app.mount('#app')