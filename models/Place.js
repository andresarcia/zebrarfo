// models/Place.js

module.exports = function(sequelize, DataTypes) {
  var Place = sequelize.define('Place', {
    name: { 
        type: DataTypes.STRING,
        allowNull: false,
    },

    numberCoordinates: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },

    power: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    frequencies: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    distance: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    shared : {
      type:DataTypes.BOOLEAN,
      defaultValue: 0
    },

    visible : {
      type:DataTypes.BOOLEAN,
      defaultValue: 1
    },

    UserId: {
      type: DataTypes.INTEGER,
      references: "Users",
      referenceKey: "id",
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
      allowNull: false
    }

  },{
    associate: function(models) {
      Place.hasMany(models.Coordinate);
      Place.hasMany(models.Outlier);
      Place.belongsTo(models.User);
    },
  });
 
  return Place;
};


