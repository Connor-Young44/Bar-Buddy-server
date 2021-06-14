"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class menu_order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      menu_order.belongsTo(models.order), menu_order.belongsTo(models.menuItem);
    }
  }
  menu_order.init(
    {
      orderId: { type: DataTypes.INTEGER, allowNull: false },
      menuItemId: { type: DataTypes.INTEGER, allowNull: false },
    },
    {
      sequelize,
      modelName: "menu_order",
    }
  );
  return menu_order;
};
