const express = require("express");
const router = express.Router();

const coursesData = require("../data/courses");
const commentsData = require("../data/comments");

const usersData = require("../data/users");
const sessionsData = require("../data/sessions");

router.get("/", async (req, res) => {
	const AuthCookie = req.cookies.AuthCookie;
	const courseCode = req.originalUrl.replace('/courses/','').trim()

	var user = await sessionsData.getSession(AuthCookie);
	var auth = (user !== undefined);

	var course = await coursesData.getCourseByCode(courseCode)

	if(!course) {
		var data = {
			title: "Error 404",
			description: "Page could not be found."
		}

		res.status(404).render("error", data);
	}

	if(auth) {
		var comments = await commentsData.getCommentsByCourseID(String(course._id))
		for (var i = 0; i < comments.length; i++) {
			(comments[i]).userID = (await usersData.getUserByID(String((comments[i]).userID))).username
		}

		data = {
			title: (course.courseName)+' ('+(course.courseCode.toUpperCase())+')',
			user: user,
			course: course,
			comments: comments
		}

		res.render("course", data);
	} else {
		var data = {
			title: "Error 403",
			description: "No user is currently logged in."
		}

		res.status(403).render("error", data);
	}
});

router.post("/", async (req, res) => {
	const AuthCookie = req.cookies.AuthCookie;
	const courseCode = req.originalUrl.replace('/courses/','').trim()

	var user = await sessionsData.getSession(AuthCookie);
	var auth = (user !== undefined);

	var course = await coursesData.getCourseByCode(courseCode)

	if(!course) {
		var data = {
			title: "Error 404",
			description: "Page could not be found."
		}

		res.status(404).render("error", data);
	}

	if(auth) {
		await commentsData.createComment(String(AuthCookie), String(course._id), req.body.comment);
		var comments = await commentsData.getCommentsByCourseID(String(course._id))
		for (var i = 0; i < comments.length; i++) {
			(comments[i]).userID = (await usersData.getUserByID(String((comments[i]).userID))).username
		}

		data = {
			title: (course.courseName)+' ('+(course.courseCode.toUpperCase())+')',
			user: user,
			course: course,
			comments: comments
		}

		res.render("course", data);
	} else {
		var data = {
			title: "Error 403",
			description: "No user is currently logged in."
		}

		res.status(403).render("error", data);
	}
});

module.exports = router;
