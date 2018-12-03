const mongoCollections = require("./mongoCollections");
const comments = mongoCollections.comments;
const Guid = require("guid");

module.exports = {
    // Create a comment
    async createComment(userID, courseID, text) {
        if (!userID) throw "UserID is invalid";
        if (!courseID) throw "CourseID is invalid";
        if (!text) throw "The text of the comment is invalid";

        const commentCollection = await comments();
        
        let newComment = {
            _id: Guid.create().toString(),
            userID: userID,
            courseID: courseID,
            text: text
        }

        const insertedComment = await commentCollection.insertOne(newComment);
        if (insertedComment.insertedCount === 0) throw "Could not add comment";
        
        const comment = await this.getComment(insertedComment.insertedId);
        return comment;
    },
    // Delete a comment by id
    async deleteComment(id) {
        if (!id) throw "ID is invalid";

        const commentCollection = await comments();
        const deletedComment = await commentCollection.removeOne({_id: id});
        if (deletedComment.deletedCount === 0) throw "Failed to remove this comment with id of ${id}";
    },

    // Update a comment by id
    async updateText(id, text) {
        if (!id) throw "ID is invalid";
        if (!text) throw "The text of the comment is invalid";
        
        let comment = await this.getComment(id);
        comment.text = text;

        const commentCollection = await comments();
        const updatedComment = await commentCollection.replaceOne({_id: id}, comment);
    
        if (updatedComment.modifiedCount === 0) throw "Failed to update comment";

        return await this.getComment(id);
    },

    // Find a specific comment by id
    async getComment(id) {
        if (!id) throw "ID is invalid";

        const commentCollection = await comments();
        const foundComment = await commentCollection.findOne({_id: id});

        if (foundComment === null) throw "No comment exists with that ID";
        
        return foundComment;
    },

    // Find all the comments of a specific userID returns an array of comments
    async getCommentsByUserID(userID) {
        if (!userID) throw "User ID is invalid";

        const commentCollection = await comments();
        const foundComment = await commentCollection.find({userID: userID}).toArray();

        if (foundComment.length === 0) throw "No comments exists associated with that user";
        
        return foundComment;
    },

    // Find all the comments of a specfic courseID returns an array of comments
    async getCommentsByCourseID(courseID) {
        if (!courseID) throw "Course ID is invalid";

        const commentCollection = await comments();
        const foundComment = await commentCollection.find({courseID: courseID}).toArray();

        if (foundComment.length === 0) throw "No comments exists associated with that course";
        
        return foundComment;
    }
};