"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class table extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      table.belongsTo(models.bar);
      table.hasMany(models.order);
    }
  }
  table.init(
    {
      number: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      seats: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      occupiedBy: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      isFree: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      barId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "table",
    }
  );
  return table;
};
