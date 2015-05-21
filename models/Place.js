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
    frequenciesBands: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    totalDistance: {
      type: DataTypes.DECIMAL(12,3),
      allowNull: true,
    },
    distanceAvg: {
      type: DataTypes.DECIMAL(12,7),
      allowNull: true,
    },
    distanceMin: {
      type: DataTypes.DECIMAL(12,7),
      allowNull: true,
    },
    distanceMax: {
      type: DataTypes.DECIMAL(12,7),
      allowNull: true,
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


