import { ApolloProvider } from "@apollo/client";
import client from "../config/apollo";
//import PedidoState from '../context/pedidos/PedidoState'

const MyApp = ({ Component, pageProps }) => {
  return (
    <ApolloProvider client={client}>
      <Component {...pageProps} />
    </ApolloProvider>
  );
};

export default MyApp;
