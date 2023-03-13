require("dotenv").config();
const envType = process.env.NODE_ENV || "development";
const database = require("./db-config.json")[envType]; //각 object를 key값으로 접근 
// db-config.json에서 NODE_ENV 명에 따라서 매칭되는 config로 접근하도록 지정
module.exports = {
  database: database,
};
