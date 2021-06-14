"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      order.belongsTo(models.user);
      order.belongsToMany(models.table, {
        through: "menu_order",
        foreignKey: "orderId",
      });
    }
  }
  order.init(
    {
      served: { type: DataTypes.BOOLEAN, allowNull: false },
      closed: { type: DataTypes.BOOLEAN, allowNull: false },
      userId: { type: DataTypes.INTEGER, allowNull: false },
      tableId: { type: DataTypes.INTEGER, allowNull: false },
    },
    {
      sequelize,
      modelName: "order",
    }
  );
  return order;
};
