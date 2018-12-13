const mongoCollections = require("../config/mongoCollections");
const users = mongoCollections.users;

const commentsData = require("./comments");
const sessionsData = require("./sessions");
const uuidv4 = require('uuid/v4');
const bcrypt = require("bcryptjs");
const saltRounds = 16;

// Find a user by ID
async function getUserByID(id) {
    if ((!id) || (typeof id !== "string")) throw "ID is invalid";

    const userCollection = await users();
    const foundUser = await userCollection.findOne({_id: id});

    if (foundUser === null) return undefined;

    return foundUser;
}

// Find a user by username
async function getUserByUsername(username) {
    if ((!username) || (typeof username !== "string")) throw "Username is invalid";
    username = username.trim().toLowerCase();

    const userCollection = await users();
    const foundUser = await userCollection.findOne({username: username});

    if (foundUser === null) return undefined;

    return foundUser;
}

// Create a User
async function createUser(username, firstName, lastName, password) {
    if ((!username) || (typeof username !== "string")) throw "Username is invalid";
    if ((!password) || (typeof password !== "string")) throw "Password is invalid";
    if ((!firstName) || (typeof firstName !== "string")) throw "First Name is invalid";
    if ((!lastName) || (typeof lastName !== "string")) throw "Last Name is invalid";

    username = username.trim().toLowerCase();
    firstName = firstName.trim();
    firstName = firstName.charAt(0).toUpperCase() + firstName.substr(1).toLowerCase();
    lastName = lastName.trim();
    lastName = lastName.charAt(0).toUpperCase() + lastName.substr(1).toLowerCase();

    const userCollection = await users();

    try {
      var userExists = await getUserByUsername(username);
    } catch (e) {
      var userExists = false;
    }

    if (userExists) throw "Could not add User";

    let newUser = {
        _id: uuidv4(),
        username: username,
        firstName: firstName,
        lastName: lastName,
        hashedPassword: bcrypt.hashSync(password, saltRounds)
    }

    const insertedUser = await userCollection.insertOne(newUser);
    if (insertedUser.insertedCount === 0) throw "Could not add User";

    const user = await getUserByUsername(username);
    return user;
}

// Delete a User by ID
async function deleteUser(id) {
    if ((!id) || (typeof id !== "string")) throw "ID is invalid";

    const userComments = await commentsData.getCommentsByUserID(id);
    const user = await this.getUserByID(id);
    var sessionID = undefined;

    if (userComments.length > 0) {
      var sessionID = String(await sessionsData.newSession(user.username));
    }

    for (var i = 0; i < userComments.length; i++) {
      await commentsData.deleteComment(sessionID, String(userComments[i]._id));
    }

    if (sessionID) {
      await sessionsData.expireSession(sessionID);
    }

    const userCollection = await users();
    const deletedUser = await userCollection.removeOne({_id: id});
    if (deletedUser.deletedCount === 0) throw "Failed to remove this user with id of ${id}";
}

// Update a User's name by ID
async function updateUser(id, firstName, lastName) {
    if ((!id) || (typeof id !== "string")) throw "ID is invalid";
    if ((!firstName) || (typeof firstName !== "string")) throw "First Name is invalid";
    if ((!lastName) || (typeof lastName !== "string")) throw "Last Name is invalid";

    firstName = firstName.trim();
    lastName = lastName.trim();

    let user = await this.getUserByID(id);
    user.firstName = firstName;
    user.lastName = lastName;

    const userCollection = await users();
    const updatedUser = await userCollection.replaceOne({_id: id}, user);

    if (updatedUser.modifiedCount === 0) throw "Failed to update user";

    return await this.getUserByID(id);
}

// Checking user credentials
async function checkCredentials(username, password) {
  if ((!username) || (typeof username !== "string")) throw "Username is invalid";
  if ((!password) || (typeof password !== "string")) throw "Password is invalid";

  username = username.trim().toLowerCase();

  try {
    var user = await getUserByUsername(username);
  } catch(e) {
    return false;
  }

  if(user && await bcrypt.compare(password, user.hashedPassword)) {
    return true;
  }
  return false;
}

module.exports = {
	getUserByID,
	getUserByUsername,
	createUser,
  deleteUser,
  updateUser,
	checkCredentials
};
