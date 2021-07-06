//setup express and import PORT from the config folder
const { PORT } = require("./config/constants");
const express = require("express");
const app = express();
require("dotenv").config();
const http = require("http");

//graphQL imports
const { ApolloServer } = require("apollo-server-express");
const { typeDefs } = require("./graphql/schema");
const resolvers = require("./graphql/resolvers");
const db = require("./models");
const jwt = require("jsonwebtoken");
const cors = require("cors");

app.use(cors());
//new apollo server
const server = new ApolloServer({
  typeDefs, //schema
  resolvers,
  context: ({ req, connection }) => {
    //get token from the header
    if (connection) {
      // check connection for metadata
      return connection.context;
    } else {
      // check from req
      const token = req.headers.authorization;

      if (token !== "null") {
        try {
          //validate user in client.
          const User = jwt.verify(token, process.env.jwtSecret);
          //console.log(user);
          //add user to request
          //req.currentUser = currentUser;

          return {
            db,
            User,
          };
        } catch (err) {
          return "";
        }
      } else {
        return { db };
      }
    }
  },
  subscriptions: {
    path: "/subscriptions",

    onConnect: (connectionParams, webSocket, context) => {
      console.log("Client connected");
      //console.log(connectionParams);
      //return { headers: connectionParams };
    },
    onDisconnect: (webSocket, context) => {
      console.log("client Disconected");
    },
  },
});

// wrap app with the appolo sever
app.use(express.json());
server.applyMiddleware({ app });
const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);

httpServer.listen(PORT, () =>
  console.log(`server up and listening on ${PORT}`)
);
