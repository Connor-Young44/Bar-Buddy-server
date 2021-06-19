//setup express and import PORT from the config folder
const { PORT } = require("./config/constants");
const express = require("express");
const app = express();
require("dotenv").config();

//graphQL imports
const { ApolloServer } = require("apollo-server-express");
const { typeDefs } = require("./graphql/schema");
const resolvers = require("./graphql/resolvers");
const db = require("./models");
const jwt = require("jsonwebtoken");

const jwtSecret = process.env.jwtSecret;
// get the user info from a JWT
const getUser = (token) => {
  try {
    if (token) {
      return jwt.verify(token, jwtSecret);
    } else {
      return null;
    }
  } catch (error) {
    return "getUser backend error";
  }
};

//new apollo server
const server = new ApolloServer({
  typeDefs, //schema
  resolvers,
  context: ({ req }) => {
    //get token from the header
    //console.log(req.headers);
    const token = req.headers.authorization || null;

    //try to retrieve user with token
    const User = getUser(token);
    //console.log(token);
    if (token === null) {
      return {
        db,
      };
    } else
      return {
        User,
        db,
      };
  },
});
// wrap app with the appolo sever
app.use(express.json());
server.applyMiddleware({ app });

app.listen(PORT, () => console.log(`server up and listening on ${PORT}`));
