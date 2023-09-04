const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define('dog', {
    id: {
      type: DataTypes.UUID, 
      primaryKey: true,  
      allowNull: false, 
      // autoIncrement: true,//GTP
      defaultValue: DataTypes.UUIDV4  
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    height_min: {
      type: DataTypes.STRING,
      allowNull: false
    },
    height_max: {
      type: DataTypes.STRING,
      allowNull: false
    },
    weight_min: {
      type: DataTypes.STRING,
      allowNull: false
    },
    weight_max: {
      type: DataTypes.STRING,
      allowNull: false
    },
    life_span_min: {
      type: DataTypes.STRING,
      allowNull: false
    },
    life_span_max: {
      type: DataTypes.STRING,
      allowNull: false
    }, 
    createdIndb: {
      type: DataTypes.BOOLEAN, 
      allowNull: false,
      defaultValue: true
    }
  }, {timestamps: false});
};
