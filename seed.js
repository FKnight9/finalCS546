const data = require("./data/index");
const users = data.users;
const courses = data.courses;
const comments = data.comments;
const sessions = data.sessions;

const main = async () => {
    let username = 'admin';
    let pass = 'PASSWORD';

    var userExists = await users.getUserByUsername(username);
    if (userExists) {
      await users.deleteUser(String(userExists._id))
    };

    try {
      var courseExists = await courses.getCourseByCode('CS546');
    } catch (e) {
      var courseExists = undefined;
    }
    if (courseExists) {
      await courses.deleteCourse(String(courseExists._id))
    }

    console.log(await users.createUser(username, 'TEST', 'ACCOUNT', pass));

    let user = await users.getUserByUsername(username);

    if(await users.checkCredentials(username, pass)) {
      let sessionID = String(await sessions.newSession(username))

      console.log(await courses.createCourse('CS546', 'Web Programming'));

      let course = await courses.getCourseByCode('CS546');

      console.log(await comments.createComment(sessionID, String(course._id), "Love this fucking class!"));

      console.log(await comments.getCommentsByUserID(String(user._id)));
    }
}

main().catch(error => {
    console.log(error);
});
