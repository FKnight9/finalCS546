const express = require("express");
const router = express.Router();

const coursesData = require("../data/courses");
const sessionsData = require("../data/sessions");

router.get("/", async (req, res) => {
	const AuthCookie = req.cookies.AuthCookie;

	var user = await sessionsData.getSession(AuthCookie);
	var auth = (user !== undefined);

	if(auth) {
		var courses = await coursesData.getCourses()

		data = {
			title: "Stevens Courses",
			user: user,
			courses: courses
		}

		res.render("courses", data);
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

	var user = await sessionsData.getSession(AuthCookie);
	var auth = (user !== undefined);

	if(auth) {

		await coursesData.createCourse(req.body.courseCode, req.body.courseName);
		var courses = await coursesData.getCourses()

		data = {
			title: "Stevens Courses",
			user: user,
			courses: courses
		}

		res.render("courses", data);

	} else {
		var data = {
			title: "Error 403",
			description: "No user is currently logged in."
		}

		res.status(403).render("error", data);
	}
});

module.exports = router;
