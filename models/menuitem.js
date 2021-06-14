"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class menuItem extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      menuItem.belongsTo(models.bar);
      menuItem.belongsToMany(models.order, {
        through: "menu_orders",
        foreignKey: "menuItemId",
      });
    }
  }
  menuItem.init(
    {
      name: { type: DataTypes.STRING, allowNull: false },
      isFood: { type: DataTypes.BOOLEAN, allowNull: false },
      imageUrl: { type: DataTypes.STRING, allowNull: false },
      desc: { type: DataTypes.TEXT, allowNull: false },
      price: { type: DataTypes.INTEGER, allowNull: false },
      barId: { type: DataTypes.INTEGER, allowNull: false },
    },
    {
      sequelize,
      modelName: "menuItem",
    }
  );
  return menuItem;
};
