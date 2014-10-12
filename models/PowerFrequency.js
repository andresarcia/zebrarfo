// models/PowerFrequency.js

module.exports = function(sequelize, DataTypes) {
  var PowerFrequency = sequelize.define('PowerFrequency', {
    frequency: { 
      type: DataTypes.DECIMAL(10,2),
      allowNull: false,
    },
    power: { 
    	type: DataTypes.DECIMAL(20,15),
      allowNull: false,
    }
  }, {
  	associate: function(models) {
    	PowerFrequency.belongsTo(models.Coordinate);
  	}

  });
 
  return PowerFrequency;
};