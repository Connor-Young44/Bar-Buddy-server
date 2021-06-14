"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "tables",
      [
        {
          number: 1,
          seats: 4,
          occupiedBy: 1,
          isFree: false,
          barId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          number: 2,
          seats: 4,
          occupiedBy: null,
          isFree: true,
          barId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          number: 3,
          seats: 4,
          occupiedBy: null,
          isFree: true,
          barId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          number: 4,
          seats: 4,
          occupiedBy: null,
          isFree: true,
          barId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          number: 5,
          seats: 4,
          occupiedBy: null,
          isFree: true,
          barId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          number: 6,
          seats: 4,
          occupiedBy: null,
          isFree: true,
          barId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          number: 7,
          seats: 4,
          occupiedBy: null,
          isFree: true,
          barId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          number: 8,
          seats: 4,
          occupiedBy: null,
          isFree: true,
          barId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          number: 9,
          seats: 4,
          occupiedBy: null,
          isFree: true,
          barId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          number: 10,
          seats: 4,
          occupiedBy: null,
          isFree: true,
          barId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("tables", null, {});
  },
};
