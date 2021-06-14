"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class bar extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      bar.belongsTo(models.user);
      bar.hasMany(models.table);
      bar.hasMany(models.menuItem);
    }
  }
  bar.init(
    {
      name: { type: DataTypes.STRING, allowNull: false },
      location: { type: DataTypes.STRING, allowNull: false },
      desc: { type: DataTypes.TEXT, allowNull: false },
      imageUrl: { type: DataTypes.STRING, allowNull: false },
      numberOfTables: { type: DataTypes.INTEGER, allowNull: false },
      userId: { type: DataTypes.INTEGER, allowNull: false },
    },
    {
      sequelize,
      modelName: "bar",
    }
  );
  return bar;
};
