import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';
//import fetch from "isomorphic-unfetch";
import { setContext } from 'apollo-link-context';
import axios from 'axios';
const httpLink = createHttpLink({
    uri: 'http://localhost:4000/',
    axios,   
});

const authLink = setContext((_, { headers }) => {

    // Leer el storage almacenado
    const token = localStorage.getItem('token');
    // console.log(token);

    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : ''
        }
    }
});


const client = new ApolloClient({
    connectToDevTools: true,
    cache: new InMemoryCache(),
    link: authLink.concat( httpLink )
});

export default client;