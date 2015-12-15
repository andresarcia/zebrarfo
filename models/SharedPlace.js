// models/SharedPlaces.js

module.exports = function(sequelize, DataTypes) {
  var SharedPlace = sequelize.define('SharedPlace', {
    name: { 
        type: DataTypes.STRING,
        allowNull: false,
    },
    place: {
      type: DataTypes.TEXT('long'),
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
      SharedPlace.belongsTo(models.User);
    },
  });
 
  return SharedPlace;
};


