// models/User.js

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    email: { 
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },

    is_subscribed: {
      type:DataTypes.BOOLEAN,
    },

    valid_hash: { 
      type: DataTypes.STRING,
      allowNull: true,
    },

    password: { 
      type: DataTypes.STRING 
    },

    rol: { 
      type: DataTypes.STRING,
      defaultValue: "contributor"
    },

    is_active: {
      type:DataTypes.BOOLEAN,
      defaultValue: true,
    },

    // roles ---------------------------------
    // superadmin
    // admin
    // editor - somebody who can write and manage their own places, unlimited (pay).
    // contributor - somebody who can write and manage their own places but limited.
    // subscriber - somebody who can only view shared places
    // ---------------------------------------
  }, {
      associate: function(models) {
        User.hasMany(models.Place);      
      }
  });

 
  return User;
};