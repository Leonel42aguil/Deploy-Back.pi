const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  sequelize.define('temperament', {
    // id: {  
    //   type: DataTypes.UUID,
    //   primaryKey: true,
    //   allowNull: false, 
    //   // autoIncrement: true,
    //   defaultValue: DataTypes.UUIDV4
    // },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    } 
  }, {timestamps: false}) 
}
// https://servidor-back-pi.onrender.com