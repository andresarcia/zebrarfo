// models/potencyFrequency.js

module.exports = function(sequelize, DataTypes) {
  var PotencyFrequency = sequelize.define('PotencyFrequency', {
    frequency: { 
      type: DataTypes.DECIMAL(10,2),
      allowNull: false,
    },
    potency: { 
    	type: DataTypes.DECIMAL(20,15),
      allowNull: false,
    }
  }, {
  	associate: function(models) {
    	PotencyFrequency.belongsTo(models.Coordinate);
  	}

  });
 
  return PotencyFrequency;
};