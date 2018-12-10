const mongoCollections = require("../config/mongoCollections");
const comments = mongoCollections.comments;

const uuidv4 = require('uuid/v4');

// Create a comment
async function createComment(userID, courseID, text) {
    if ((!userID) || (typeof userID !== "string")) throw "UserID is invalid";
    if ((!courseID) || (typeof courseID !== "string")) throw "CourseID is invalid";
    if ((!text) || (typeof text !== "string")) throw "The text of the comment is invalid";

    const commentCollection = await comments();

    let newComment = {
        _id: uuidv4(),
        userID: userID,
        courseID: courseID,
        text: text
    }

    const insertedComment = await commentCollection.insertOne(newComment);
    if (insertedComment.insertedCount === 0) throw "Could not add comment";

    const comment = await this.getComment(insertedComment.insertedId);
    return comment;
}

// Delete a comment by id
async function deleteComment(id) {
    if ((!id) || (typeof id !== "string")) throw "ID is invalid";

    const commentCollection = await comments();
    const deletedComment = await commentCollection.removeOne({_id: id});
    if (deletedComment.deletedCount === 0) throw "Failed to remove this comment with id of ${id}";
}

// Update a comment by id
async function updateComment(id, text) {
    if ((!id) || (typeof id !== "string")) throw "ID is invalid";
    if ((!text) || (typeof text !== "string")) throw "The text of the comment is invalid";

    let comment = await this.getComment(id);
    comment.text = text;

    const commentCollection = await comments();
    const updatedComment = await commentCollection.replaceOne({_id: id}, comment);

    if (updatedComment.modifiedCount === 0) throw "Failed to update comment";

    return await this.getComment(id);
}

// Find a specific comment by id
async function getCommentByID(id) {
    if ((!userID) || (typeof userID !== "string")) throw "UserID is invalid";

    const commentCollection = await comments();
    const foundComment = await commentCollection.findOne({_id: id});

    if (foundComment === null) throw "No comment exists with that ID";

    return foundComment;
}

// Find all the comments of a specific userID returns an array of comments
async function getCommentsByUsername(userID) {
    if ((!userID) || (typeof userID !== "string")) throw "UserID is invalid";

    const commentCollection = await comments();
    const foundComment = await commentCollection.find({userID: userID}).toArray();

    //if (foundComment.length === 0) throw "No comments exists associated with that user";

    return foundComment;
}

// Find all the comments of a specfic courseID returns an array of comments
async function getCommentsByCourseID(courseID) {
    if ((!courseID) || (typeof courseID !== "string")) throw "CourseID is invalid";

    const commentCollection = await comments();
    const foundComment = await commentCollection.find({courseID: courseID}).toArray();

    //if (foundComment.length === 0) throw "No comments exists associated with that course";

    return foundComment;
}

module.exports = {
  createComment,
  deleteComment,
  updateComment,
  getCommentByID,
  getCommentsByUsername,
  getCommentsByCourseID
};
