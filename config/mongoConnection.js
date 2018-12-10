const MongoClient = require("mongodb").MongoClient;
const config = require("./config");
const mongoConfig = config.mongoConfig;

let _connection = undefined;
let _db = undefined;

module.exports = async () => {
  if (!_connection) {
    _connection = await MongoClient.connect(mongoConfig.serverUrl, { useNewUrlParser: true });
    _db = await _connection.db(mongoConfig.database);
  }

  return _db;
};
