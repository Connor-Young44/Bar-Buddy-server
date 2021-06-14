"use strict";
const bcrypt = require("bcrypt");
const { saltRounds } = require("../config/constants");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "users",
      [
        {
          firstName: "Connor",
          lastName: "Young",
          email: "connor@young.com",
          password: bcrypt.hashSync("test", saltRounds),
          isBuisness: false,
          currentBar: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          firstName: "Maartje",
          lastName: "Young",
          email: "maartje@young.com",
          password: bcrypt.hashSync("test", saltRounds),
          isBuisness: false,
          currentBar: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          firstName: "Floki",
          lastName: "Young",
          email: "connor@young.com",
          password: bcrypt.hashSync("test", saltRounds),
          isBuisness: true,
          currentBar: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("users", null, {});
  },
};
