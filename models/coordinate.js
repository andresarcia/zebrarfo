// models/Coordinate.js

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
    powerSD : {
      type: DataTypes.DECIMAL(10,6),
      allowNull: true,
    },
    createdDate : {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    visible : {
      type:DataTypes.BOOLEAN,
      defaultValue: 1
    },

    PlaceId: {
      type: DataTypes.INTEGER,
      references: "Places",
      referenceKey: "id",
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
      allowNull: false
    }

  }, {

    associate: function(models) {
      Coordinate.belongsTo(models.Place);
      Coordinate.hasMany(models.Capture);            
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