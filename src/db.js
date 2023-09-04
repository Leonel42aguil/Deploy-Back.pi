require('dotenv').config();
const { Sequelize } = require('sequelize');
const fs = require('fs');
const path = require('path');
require('dotenv').config()
const {   
  DB_USER, DB_PASSWORD, DB_HOST,DB_NAME, DB_DEPLOY
} = process.env;   
 
// const sequelize = new Sequelize(`postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:/${DB_NAME}`, {
//   logging: false, 
//   dialect: 'postgres', 
// }); 
 
const sequelize = new Sequelize(DB_DEPLOY, {
  logging: false, 
  dialect: 'postgres',
  native: false,
  dialectOptions: { 
    ssl: {
      require: false
    }
  }
});


const basename = path.basename(__filename);

const modelDefiners = [] ;

// Leemos todos los archivos de la carpeta Models, los requerimos y agregamos al arreglo modelDefiners
fs.readdirSync(path.join(__dirname, '/models'))
  .filter((file) => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
  .forEach((file) => {
    modelDefiners.push(require(path.join(__dirname, '/models', file)));
  });

// Injectamos la conexion (sequelize) a todos los modelos
modelDefiners.forEach(model => model(sequelize));
// Capitalizamos los nombres de los modelos ie: product => Product
let entries = Object.entries(sequelize.models);
let capsEntries = entries.map((entry) => [entry[0][0].toUpperCase() + entry[0].slice(1), entry[1]]);
sequelize.models = Object.fromEntries(capsEntries);
    
const { Dog, Temperament } = sequelize.models; 
 
Dog.belongsToMany(Temperament, {through: "dog_temperament" });//timestamps: Marcas de tiempo se usan para rastrear las fechas de creación
Temperament.belongsToMany(Dog, {through: "dog_temperament" });

module.exports = {
  ...sequelize.models, // para poder importar los modelos así: const { Product, User } = require('./db.js');
  conn: sequelize,     // para importart la conexión { conn } = require('./db.js');
};
