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
    numberPowerFrequency: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    frequencyMin: {
      type: DataTypes.DECIMAL(12,3),
      allowNull: true,
    },
    frequencyMax: {
      type: DataTypes.DECIMAL(12,3),
      allowNull: true,
    },
    totalDistance: {
      type: DataTypes.DECIMAL(12,3),
      allowNull: true,
    },
    distaceAvg: {
      type: DataTypes.DECIMAL(12,7),
      allowNull: true,
    },
    distaceMin: {
      type: DataTypes.DECIMAL(12,7),
      allowNull: true,
    },
    distaceMax: {
      type: DataTypes.DECIMAL(12,7),
      allowNull: true,
    },

    UserId: {
      type: DataTypes.INTEGER,
      references: "Users",
      referenceKey: "id",
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
      allowNull: false
    }

  });
 
  return Place;
};


