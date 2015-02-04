// models/Capture.js

module.exports = function(sequelize, DataTypes) {
  var Capture = sequelize.define('Capture', {
    
    frequency: { 
      type: DataTypes.DECIMAL(10,2),
      allowNull: false,
    },
    power: { 
    	type: DataTypes.DECIMAL(20,15),
      allowNull: false,
    },

    CoordinateId: {
      type: DataTypes.INTEGER,
      references: "Coordinates",
      referenceKey: "id",
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
      allowNull: false
    }

  }, {

    associate: function(models) {
      Capture.belongsTo(models.Coordinate);
    }

  });
 
  return Capture;
};