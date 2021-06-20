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
    me: async (parent, _args, { User, db }, info) => {
      //console.log("me query called");
      //console.log(User.userId);
      //console.log(User);
      if (User === null) {
        return;
      }
      //console.log(User);
      return db.user.findOne({ where: User.userId });
    },
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
  //****MUTATIONS */
  Mutation: {
    login: async (parent, { email, password }, { db }, info) => {
      const user = await db.user.findOne({
        where: { email: email },
      });

      if (!user) return new ApolloError("User with that email not found", 404);
      const matchingPassword = bcrypt.compareSync(password, user.password);

      if (!matchingPassword) return new ApolloError("incorect Password", 400);
      //console.log(user.dataValues.id);

      const token = toJwt({ userId: user.dataValues.id });

      return { token };
    },
    //SIGN UP
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
    //NEW BAR
    createBar: async (
      parent,
      { name, location, desc, imageUrl, numberOfTables, userId },
      { db },
      info
    ) => {
      //validate inputs
      if (!name) return new ApolloError("Your Bar Needs a Name!", 400);
      if (!location) return new ApolloError("Please Provide Address", 400);
      if (!desc)
        return new ApolloError(
          "Please Provide a Short Description of Your Bar!",
          400
        );
      if (!imageUrl)
        return new ApolloError("Please an image url of your bar!", 400);
      if (!numberOfTables)
        return new ApolloError("Please Provide a Number of Tables", 400);
      if (!userId)
        return new ApolloError(
          "you must be logged in to create a new bar",
          400
        );

      //if all inputs are valid create new user

      const newBar = await db.bar.create({
        name,
        location,
        desc,
        imageUrl,
        numberOfTables,
        userId,
      });

      return newBar;
    },
    editBar: async (
      parent,
      { id, name, location, desc, imageUrl, numberOfTables, userId },
      { db },
      info
    ) => {
      //console.log(location);
      const bar = await db.bar.findOne({ where: { id: id } });
      if (!bar) return new ApolloError("bar not found", 400);
      if (name !== undefined) {
        bar.name = name;
      }
      if (location !== undefined) {
        bar.location = location;
      }
      if (desc !== undefined) {
        bar.desc = desc;
      }
      if (imageUrl !== undefined) {
        bar.imageUrl = imageUrl;
      }
      if (numberOfTables !== undefined) {
        bar.numberOfTables = numberOfTables;
      }

      updatedBar = await db.bar.update(
        {
          id,
          name: bar.name,
          location: bar.location,
          desc: bar.desc,
          imageUrl: bar.imageUrl,
          numberOfTables: bar.numberOfTables,
          userId,
        },
        { where: { id: id } }
      );
      // console.log(bar);
      return bar;
    },
  },
};
