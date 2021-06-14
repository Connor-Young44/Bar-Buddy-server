"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "orders",
      [
        {
          served: true,
          closed: false,
          userId: 1,
          tableId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          served: false,
          closed: false,
          userId: 1,
          tableId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("orders", null, {});
  },
};
