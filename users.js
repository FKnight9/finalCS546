const mongoCollections = require("./mongoCollections");
const users = mongoCollections.users;
const Guid = require("guid");

module.exports = {
    // Create a User
    async createUser(username, password, firstName, lastName) {
        if (!username) throw "Username is invalid";
        if (!password) throw "Password is invalid";
        if (!firstName) throw "First Name is invalid";
        if (!lastName) throw "Second Name is invalid";

        const userCollection = await users();
        
        let newUser = {
            _id: Guid.create().toString(),
            username: username,
            password: password,
            firstName: firstName,
            lastName:lastName
        }

        const insertedUser = await userCollection.insertOne(newUser);
        if (insertedUser.insertedCount === 0) throw "Could not add User";
        
        const user = await this.getUser(insertedUser.insertedId);
        return user;
    },

    // Delete a User by ID
    async deleteUser(id) {
        if (!id) throw "ID is invalid";

        const userCollection = await todoItems();
        const deletedUser = await userCollection.removeOne({_id: id});
        if (deletedUser.deletedCount === 0) throw "Failed to remove this user with id of ${id}";
    },

    // Update a User's name by ID
    async updateUser(id, firstName, lastName) {
        if (!id) throw "ID is invalid";
        if (!firstName) throw "First Name is invalid";
        if (!lastName) throw "Second Name is invalid";

        let user = await this.getUser(id);
        user.firstName = firstName;
        user.lastName = lastName;

        const userCollection = await users();
        const updatedUser = await userCollection.replaceOne({_id: id}, user);
    
        if (updatedUser.modifiedCount === 0) throw "Failed to update user";

        return await this.getUser(id);
    },

    // Find a user by ID
    async getUser(id) {
        if (!id) throw "ID is invalid";

        const userCollection = await users();
        const foundUser = await userCollection.findOne({_id: id});

        if (foundUser === null) throw "No user exists with that ID";
        
        return foundUser;
    },

    // Find a user by username
    async getUserByUsername(username) {
        if (!username) throw "ID is invalid";

        const userCollection = await users();
        const foundUser = await userCollection.findOne({username: username});

        if (foundUser === null) throw "No user exists with that username";
        
        return foundUser;
    }
    // Future things with Password
};