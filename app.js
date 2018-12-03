const users = require("./users");
const courses = require("./courses");
const comments = require("./comments");

const main = async () => {

    // console.log(await comments.createComment("1", "10", "First comment"));
    // console.log(await comments.createComment("1", "20", "Second comment"));
    // console.log(await comments.createComment("2", "10", "Third comment"));
    // console.log(await comments.createComment("2", "30", "Fourth comment"));
    
    console.log(await comments.getCommentsByCourseID("1"));

}

main().catch(error => {
    console.log(error);
});