const express = require("express");
const router = express.Router();

const coursesData = require("../data/courses");
const commentsData = require("../data/comments");

const usersData = require("../data/users");
const sessionsData = require("../data/sessions");

router.get("/", async (req, res) => {
	const AuthCookie = req.cookies.AuthCookie;

	const commentID = req.originalUrl.replace('/comment/','').trim()
	var comment = await commentsData.getCommentByID(String(commentID))

	if(comment) {
		var user = await sessionsData.getSession(AuthCookie);
		var auth = (user !== undefined);

		var course = await coursesData.getCourseByID(String(comment.courseID))

		if(!course) {
			res.redirect("/courses");
		} else {
			if(auth) {
				await commentsData.deleteComment(String(AuthCookie), String(comment._id))
			}
			res.redirect("/courses/"+course.courseCode);
		}
	}
});

module.exports = router;
