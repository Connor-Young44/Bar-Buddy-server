'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class menu_order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  menu_order.init({
    orderId: DataTypes.INTEGER,
    menuItemId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'menu_order',
  });
  return menu_order;
};