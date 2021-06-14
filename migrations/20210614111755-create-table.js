"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("tables", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      number: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      seats: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      occupiedBy: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      isFree: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
      },
      barId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "bars",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("tables");
  },
};
