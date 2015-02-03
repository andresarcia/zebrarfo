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

    password: { type: DataTypes.STRING },
    
  }, {
      associate: function(models) {
        User.hasMany(models.Place);      
      }
  });

 
  return User;
};