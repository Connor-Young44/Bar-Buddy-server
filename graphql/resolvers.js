//const { ApolloError } = require("apollo-server-express");
//const bcrypt = require('bcrypt')

//db => models from sequelize
module.exports = {
  Query: {
    users: async (parent, _args, { db }, info) => {
      return db.user.findAll();
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
};
