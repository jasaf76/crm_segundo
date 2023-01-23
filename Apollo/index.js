const { ApolloServer } = require("apollo-server");

const typeDefs = require("./db/schema.gql");
const resolvers = require("./db/resolvers");
const connectDB = require("./config/db");
const jwt = require("jsonwebtoken");
require("dotenv").config({ path: "variables.env" });
// Connect to the database
connectDB();
// Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    // console.log(req.headers["authorization"]);
    const token = req.headers["authorization"] || "";
    if (token) {
      try {
        const user = jwt.verify(
          token.replace('Bearer ', ''),
          process.env.SECRET
        );
        console.log(user);
        return {
          user,
        };
      } catch (error) {
        console.log('error de token',token)
        console.log(error);
      }
    }
  },
});

// Start the server

server.listen({ port: process.env.PORT || 4000 }).then( ({url}) => {
    console.log(`Servidor listo en la URL ${url}`)
} )