// models/PowerFrequency.js

module.exports = function(sequelize, DataTypes) {
  var PowerMode = sequelize.define('PowerMode', {
    power: { 
      type: DataTypes.DECIMAL(18,15),
      allowNull: false,
    },

    frequency: { 
      type: DataTypes.INTEGER,
      allowNull: false,
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
      PowerMode.belongsTo(models.Place);
    }

  });
 
  return PowerMode;
};