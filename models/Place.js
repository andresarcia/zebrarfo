// models/place.js

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
    powerMin: {
      type: DataTypes.DECIMAL(10,6),
      allowNull: true,
    },
    powerMax : {
      type: DataTypes.DECIMAL(10,6),
      allowNull: true,
    },
    powerAvg : {
      type: DataTypes.DECIMAL(10,6),
      allowNull: true,
    },
    sdPowerAvg : {
      type: DataTypes.DECIMAL(10,6),
      allowNull: true,
    },
    avgPowerSD : {
      type: DataTypes.DECIMAL(10,6),
      allowNull: true,
    },
  }, {

    associate: function(models) {
        Place.hasMany(models.Coordinate);      
      Place.belongsTo(models.User);
    },

  });
 
  return Place;
};


