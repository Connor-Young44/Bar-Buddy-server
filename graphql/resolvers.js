const { ApolloError } = require("apollo-server-express");
const bcrypt = require("bcrypt");
const { toJwt } = require("../auth/jwt");
const { saltRounds } = require("../config/constants");

//db => models from sequelize
module.exports = {
  Query: {
    //all users
    users: async (parent, _args, { db }, info) => {
      return db.user.findAll();
    },
    //one user
    //singleUser: async (parent, _args, { db }, info) => {},
    bars: async (parent, _args, { db }, info) => {
      return db.bar.findAll({ include: [db.user, db.table] });
    },

    tables: async (parent, _args, { db }, info) => {
      return db.table.findAll({ include: [db.bar, db.order] });
    },
    orders: async (parent, _args, { db }, info) => {
      return db.order.findAll({ include: [db.table, db.user, db.menuItem] });
    },
    menuItems: async (parent, _args, { db }, info) => {
      return db.menuItem.findAll({ include: [db.bar] });
    },
  },
  Mutation: {
    login: async (parent, { email, password }, { db }, info) => {
      const user = await db.user.findOne({
        where: { email },
      });

      if (!user) return new ApolloError("User with that email not found", 404);
      const matchingPassword = bcrypt.compareSync(password, user.password);

      if (!matchingPassword) return new ApolloError("incorect Password", 400);

      const token = toJwt({ userId: user.id });
      return { token, user };
    },
    signup: async (
      parent,
      { firstName, lastName, email, password, isBuisness },
      { db },
      info
    ) => {
      //validate inputs
      if (!firstName) return new ApolloError("Please Provide First Name", 400);
      if (!lastName) return new ApolloError("Please Provide Second Name", 400);
      if (!email) return new ApolloError("Please Provide email", 400);
      if (!password) return new ApolloError("Please create a password", 400);
      //check for unique email
      const user = await db.user.findOne({ where: { email } });
      //console.log(user);
      if (user) return new ApolloError("Only 1 user is allowed that email");
      //if all inputs are valid create new user
      const hashedPassword = bcrypt.hashSync(password, saltRounds);
      const newUser = await db.user.create({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        isBuisness,
      });

      delete newUser["password"];
      return newUser;
    },
  },
};
