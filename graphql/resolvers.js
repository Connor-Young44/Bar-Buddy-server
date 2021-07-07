const { ApolloError } = require("apollo-server-express");
const bcrypt = require("bcrypt");
const { toJwt } = require("../auth/jwt");
const { saltRounds } = require("../config/constants");
const pubsub = require("../pubSub");

//db => models from sequelize

module.exports = {
  Query: {
    //all users
    users: async (parent, { barId }, { db }, info) => {
      return db.user.findAll({ where: { currentBar: barId } });
    },
    //one user
    me: async (parent, _args, { User, db }, info) => {
      if (User === undefined) {
        return;
      }

      return db.user.findOne({ where: User.userId });
    },
    bars: async (parent, _args, { db }, info) => {
      return db.bar.findAll({ include: [db.user, db.table] });
    },

    tables: async (parent, { barId }, { db }, info) => {
      return db.table.findAll({
        where: { barId: barId },
        include: [db.order],
      });
    },
    orders: async (parent, __args, { db }, info) => {
      return db.order.findAll({
        include: [db.table, db.user, db.menuItem],
      });
    },
    menuItems: async (parent, { barId }, { db }, info) => {
      return db.menuItem.findAll({
        where: { barId: barId },
      });
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
      //console.log(user);
      const token = toJwt({ userId: user.dataValues.id });

      return { token, user };
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

      //if all inputs are valid create new bar

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
    editUser: async (
      parent,
      { id, firstName, lastName, email, password, currentBar, isBuisness },
      { db },

      info
    ) => {
      const user = await db.user.findOne({ where: { id: id } });
      //console.log(user);
      if (!user) return new ApolloError("user not found", 400);
      if (firstName !== undefined) {
        user.firstName = firstName;
      }
      if (lastName !== undefined) {
        user.lastName = lastName;
      }
      if (email !== undefined) {
        user.email = email;
      }
      if (password !== undefined) {
        user.password = password;
      }
      if (currentBar !== undefined) {
        user.currentBar = currentBar;
      }
      if (isBuisness !== undefined) {
        user.isBuisness = isBuisness;
      }
      pubsub.publish("USER JOINED", { userJoined: user });
      updatedUser = await db.user.update(
        {
          id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          password: user.password,
          currentBar: user.currentBar,
          isBuisness: user.isBuisness,
        },
        { where: { id: id } }
      );
      // console.log(user);
      return user;
    },

    addMenuItem: async (
      parent,
      { name, isFood, desc, imageUrl, price, barId },
      { db },
      info
    ) => {
      //validate inputs
      if (!name) return new ApolloError("Your Menu Item Needs a Name!", 400);

      if (!desc)
        return new ApolloError(
          "Please Provide a Short Description of Your item!",
          400
        );
      if (!imageUrl)
        return new ApolloError("Please an image url of your item!", 400);
      if (!price) return new ApolloError("Please Provide a Price", 400);
      if (!barId) return new ApolloError("Not Assoisiated to a bar ", 400);

      //if all inputs are valid create new item

      const newItem = await db.menuItem.create({
        name,
        isFood,
        desc,
        imageUrl,
        price,
        barId,
      });

      return newItem;
    },
    placeOrder: async (
      parent,
      { served, closed, qty, userId, tableId, menuItemId },
      { db },
      info
    ) => {
      const newOrder = await db.order.create({
        served,
        closed,
        qty,
        userId,
        tableId,
      });
      //console.log(newOrder.dataValues.id);
      const newMenuOrder = await db.menu_order.create({
        orderId: newOrder.dataValues.id,
        menuItemId,
      });
      pubsub.publish("ORDER PLACED", { orderPlaced: newOrder });
      //console.log(newOrder);
      return { order: newOrder, menu_order: newMenuOrder };
    },
    //edit order for served / closed
    editOrder: async (
      parent,
      { id, served, closed, qty, userId, tableId },
      { db },
      info
    ) => {
      const order = await db.order.findOne({ where: { id: id } });

      if (!order) return new ApolloError("order not found", 400);
      if (served !== undefined) {
        order.served = served;
      }
      if (closed !== undefined) {
        order.closed = closed;
      }
      if (qty !== undefined) {
        order.qty = qty;
      }
      if (userId !== undefined) {
        order.userId = userId;
      }
      if (tableId !== undefined) {
        order.tableId = tableId;
      }
      updatedOrder = await db.order.update(
        {
          id,
          served: order.served,
          closed: order.closed,
          qty: order.qty,
          userId: order.userId,
          tableId: order.tableId,
        },
        { where: { id: id } }
      );

      return updatedOrder;
    },
    createTable: async (
      parent,
      { number, seats, occupiedBy, isFree, barId },
      { db },
      info
    ) => {
      //validate inputs
      if (!number) return new ApolloError("Your Table Needs a Number!", 400);
      if (!seats)
        return new ApolloError("Please Provide a number of seats", 400);
      if (!barId) return new ApolloError("Not Assoisiated to a bar ", 400);

      const tables = await db.table.findAll({ where: { barId } });
      const tableExists = tables.filter((e) => e.number === number);
      //console.log(tableExists);
      if (tableExists.length > 0)
        return new ApolloError("Only 1 table can be asigned that table number");

      //if all inputs are valid create new table
      const newTable = await db.table.create({
        number,
        seats,
        occupiedBy,
        isFree,
        barId,
      });
      return newTable;
    },
    editTable: async (
      parent,
      { id, number, seats, occupiedBy, isFree, barId },
      { db },
      info
    ) => {
      const table = await db.table.findOne({ where: { id: id } });

      if (!table) return new ApolloError("table not found", 400);
      if (number !== undefined) {
        table.number = number;
      }
      if (seats !== undefined) {
        table.seats = seats;
      }
      if (occupiedBy !== undefined) {
        table.occupiedBy = occupiedBy;
      }
      if (isFree !== undefined) {
        table.isFree = isFree;
      }
      if (barId !== undefined) {
        table.barId = barId;
      }
      updatedTable = await db.table.update(
        {
          id,
          number: table.number,
          seats: table.seats,
          occupiedBy: table.occupiedBy,
          isFree: table.isFree,
          barId: table.barId,
        },
        { where: { id: id } }
      );

      return table;
    },
  },
  Subscription: {
    userJoined: {
      subscribe: () => pubsub.asyncIterator(["USER JOINED"]),
    },
    orderPlaced: {
      subscribe: () => pubsub.asyncIterator(["ORDER PLACED"]),
    },
  },
};
