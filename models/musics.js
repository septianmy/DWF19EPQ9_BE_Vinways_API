'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class musics extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      musics.belongsTo(models.artist, {
          as : "artists",
          foreignKey: {
            name: "artistId"
          }
      });
    }
  };
  musics.init({
    title: DataTypes.STRING,
    year: DataTypes.STRING,
    artistId: DataTypes.INTEGER,
    thumbnail: DataTypes.STRING,
    attachment: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'musics',
  });
  return musics;
};