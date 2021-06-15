//setup express and import PORT from the config folder
const { PORT } = require("./config/constants");
const express = require("express");
const app = express();

//graphQL imports
const { ApolloServer } = require("apollo-server-express");
const { typeDefs } = require("./graphql/schema");
const resolvers = require("./graphql/resolvers");
const db = require("./models");

app.use(express.json());

//new apollo server
const server = new ApolloServer({
  typeDefs, //schema
  resolvers,
  context: ({ req }) => ({ req, db }),
});
// wrap app with the appolo sever
server.applyMiddleware({ app });

app.listen(PORT, () => console.log(`server up and listening on ${PORT}`));
