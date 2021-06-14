"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "menuItems",
      [
        {
          name: "Heineken",
          isFood: false,
          imageUrl:
            "https://drinksfeed.com/wp-content/blogs.dir/1/files/2020/09/Heineken-brewed-with-green-energy-in-The-Netherlands.png",
          desc: "a lovely cold beer that everyone likes",
          price: 2.5,
          barId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("menuItems", null, {});
  },
};
