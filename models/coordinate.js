// models/coordinate.js

module.exports = function(sequelize, DataTypes) {
  var Coordinate = sequelize.define('Coordinate', {
    latitude: {
      type: DataTypes.DECIMAL(20,15),
      allowNull: false,
      validate: { min: -90, max: 90 }
    },
    longitude: {
      type: DataTypes.DECIMAL(20,15),
      allowNull: false,
      validate: { min: -180, max: 180 }
    },
    numberPotencyFrequency: {
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
    potencySD : {
      type: DataTypes.DECIMAL(10,6),
      allowNull: true,
    },
    createdDate : {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    }
  }, {

    associate: function(models) {
      Coordinate.belongsTo(models.Place);
      Coordinate.hasMany(models.PotencyFrequency);            
    },

    validate: {
      bothCoordsOrNone: function() {
        if ((this.latitude === null) || (this.longitude === null)) {
          throw new Error('Require either both latitude and longitude');
        }
      }
    },

  });
 
  return Coordinate;
};