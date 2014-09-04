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
    potencyMin: {
      type: DataTypes.DECIMAL(10,6),
      allowNull: true,
    },
    potencyMax : {
      type: DataTypes.DECIMAL(10,6),
      allowNull: true,
    },
    potencyAvg : {
      type: DataTypes.DECIMAL(10,6),
      allowNull: true,
    },
    sdPotencyAvg : {
      type: DataTypes.DECIMAL(10,6),
      allowNull: true,
    },
    avgPotencySD : {
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


