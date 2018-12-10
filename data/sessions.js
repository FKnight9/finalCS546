const mongoCollections = require("../config/mongoCollections");
const sessions = mongoCollections.sessions;

const uuidv4 = require('uuid/v4');
const usersData = require("./users");

async function getSession(id) {
  if ((!id) || (typeof id !== "string")) throw "ID is invalid";

  let sessionsCollection = await sessions();
  let session = await sessionsCollection.findOne({_id: id});
  let user = usersData.getUserByUsername(session.username)
  return user;
}

async function newSession(username) {
  if ((!username) || (typeof username !== "string")) throw "Username is invalid";

  username = username.trim().toLowerCase();

  let sessionsCollection = await sessions();
  const session = {
    _id: uuidv4(),
    username: username//,
    //datetime: datetime.create().toObject()
  };

  const insertSession = await sessionsCollection.insertOne(session);
  return session._id;
}

async function expireSession(id) {
  if ((!id) || (typeof id !== "string")) throw "ID is invalid";

  let sessionsCollection = await sessions();
  await sessionsCollection.removeOne({_id: id});
  return 0
}

module.exports = {
    getSession,
    newSession,
    expireSession
};
