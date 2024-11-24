import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

const client = new ApolloClient({
  uri: 'http://localhost:8082/graphql',  // L'URL de votre serveur GraphQL
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      {/* Votre composant App ici */}
    </ApolloProvider>
  );
}

export default App;
