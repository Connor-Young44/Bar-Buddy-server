const { gql } = require("apollo-server-express");

///define types, queries and mutations here!!!!!!!!!!!!!
const typeDefs = gql`
  type User {
    id: ID!
    firstName: String!
    lastName: String!
    email: String!
    password: String!
    isBuisness: Boolean!
    currentBar: Int
  }
  type Bar {
    id: ID!
    name: String!
    location: String!
    desc: String!
    imageUrl: String!
    numberOfTables: Int!
    user: User
    tables: [Table]
  }
  type Table {
    id: ID!
    number: Int!
    seats: Int!
    occupiedBy: Int
    isFree: Boolean
    bar: Bar
    orders: [Order]
  }
  type Order {
    id: ID!
    served: Boolean!
    closed: Boolean!
    qty: Int
    user: User
    table: Table
    menuItems: [MenuItem]
  }
  type MenuItem {
    id: ID!
    name: String
    isFood: Boolean!
    imageUrl: String!
    desc: String!
    price: Int!
    bar: [Bar]
  }
  type Menu_Order {
    id: ID!
    order: [Order]
    menuItem: [MenuItem]
  }

  type Query {
    users: [User]
    bars: [Bar]
    orders: [Order]
    tables: [Table]
    menuItems: [MenuItem]
  }
`;

module.exports = { typeDefs };
