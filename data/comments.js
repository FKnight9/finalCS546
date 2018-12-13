const mongoCollections = require("../config/mongoCollections");
const comments = mongoCollections.comments;

const sessionsData = require("./sessions");
const uuidv4 = require('uuid/v4');
const Filter = require('bad-words'),
filter = new Filter();

// Create a comment
async function createComment(sessionID, courseID, text) {
    if ((!sessionID) || (typeof sessionID !== "string")) throw "SessionID is invalid";
    if ((!courseID) || (typeof courseID !== "string")) throw "CourseID is invalid";
    if ((!text) || (typeof text !== "string")) throw "The text of the comment is invalid";

    var user = await sessionsData.getSession(sessionID);
    if (user === undefined) throw "Could not add comment";

    const commentCollection = await comments();

    let newComment = {
        _id: uuidv4(),
        userID: user._id,
        courseID: courseID,
        text: filter.clean(text)
    }

    const insertedComment = await commentCollection.insertOne(newComment);
    if (insertedComment.insertedCount === 0) throw "Could not add comment";

    const comment = await this.getCommentByID(newComment._id);
    return comment;
}

// Find a specific comment by id
async function getCommentByID(id) {
    if ((!id) || (typeof id !== "string")) throw "ID is invalid";

    const commentCollection = await comments();
    const foundComment = await commentCollection.findOne({_id: id});

    if (foundComment === null) return undefined;

    return foundComment;
}

// Find all the comments of a specific userID returns an array of comments
async function getCommentsByUserID(userID) {
    if ((!userID) || (typeof userID !== "string")) throw "UserID is invalid";

    const commentCollection = await comments();
    const foundComment = await commentCollection.find({userID: userID}).toArray();

    return foundComment;
}

// Find all the comments of a specfic courseID returns an array of comments
async function getCommentsByCourseID(courseID) {
    if ((!courseID) || (typeof courseID !== "string")) throw "CourseID is invalid";

    const commentCollection = await comments();
    const foundComment = await commentCollection.find({courseID: courseID}).toArray();

    return foundComment;
}

// Delete a comment by id
async function deleteComment(sessionID, commentID) {
    if ((!sessionID) || (typeof sessionID !== "string")) throw "SessionID is invalid";
    if ((!commentID) || (typeof commentID !== "string")) throw "CommentID is invalid";

    var user = await sessionsData.getSession(sessionID);
    if (user === undefined) throw "Failed to remove this comment with id of ${commentID}";

    let comment = await this.getCommentByID(commentID);
    if (user._id !== comment.userID) throw "Failed to remove this comment with id of ${commentID}";

    const commentCollection = await comments();
    const deletedComment = await commentCollection.removeOne({_id: commentID});
    if (deletedComment.deletedCount === 0) throw "Failed to remove this comment with id of ${commentID}";
}

// Update a comment by id
async function updateComment(sessionID, commentID, text) {
    if ((!sessionID) || (typeof sessionID !== "string")) throw "SessionID is invalid";
    if ((!commentID) || (typeof commentID !== "string")) throw "CommentID is invalid";
    if ((!text) || (typeof text !== "string")) throw "The text of the comment is invalid";

    var user = await sessionsData.getSession(sessionID);
    if (user === undefined) throw "Failed to update comment";

    let comment = await this.getCommentByID(commentID);
    if (user._id !== comment.userID) throw "Failed to update comment";
    comment.text = filter.clean(text);

    const commentCollection = await comments();
    const updatedComment = await commentCollection.replaceOne({_id: commentID}, comment);

    if (updatedComment.modifiedCount === 0) throw "Failed to update comment";

    return await this.getCommentByID(commentID);
}

module.exports = {
  createComment,
  getCommentByID,
  getCommentsByUserID,
  getCommentsByCourseID,
  deleteComment,
  updateComment
};
