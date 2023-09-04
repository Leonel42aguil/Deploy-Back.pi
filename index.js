const server = require('./src/app.js');
const { conn } = require('./src/db.js');
require('dotenv').config()
const { PORT, DB_DEPLOY } = process.env
const pg = require('pg') 

const pool = new pg.Pool({
  connectionString : DB_DEPLOY,
  ssl: true
})

conn.sync({ force: true }).then(() => {
  server.listen(PORT, () => {
    console.log('%s listening at', PORT); 
  });
});
