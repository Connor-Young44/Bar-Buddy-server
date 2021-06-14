'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class menuItem extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  menuItem.init({
    name: DataTypes.STRING,
    isFood: DataTypes.BOOLEAN,
    imageUrl: DataTypes.STRING,
    desc: DataTypes.TEXT,
    price: DataTypes.INTEGER,
    barId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'menuItem',
  });
  return menuItem;
};