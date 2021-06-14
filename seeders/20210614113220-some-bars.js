"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "bars",
      [
        {
          name: "Floki's Bench",
          location: "House of Floki, 44 Floki street",
          desc: "Come to the best water bowl in Bussum! where we always have ice-cubes in our water! we also have a vast array of snacks and treats!",
          imageUrl:
            "https://www.uitagenda.nl/storage/location/Cafe-t-Raedthuys-Bussum_uitagenda.jpg",
          numberOfTables: 10,
          userId: 3,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("bars", null, {});
  },
};
