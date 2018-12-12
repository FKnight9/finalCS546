const express = require("express");
const router = express.Router();

const userData = require("../data/users");
const sessionsData = require("../data/sessions");

router.get("/", async (req, res) => {
	const sid = req.cookies.AuthCookie;

	try {
		var auth = await sessionsData.getSession(sid) !== undefined;
	} catch(e) {
		var auth = false;
	}

	if(auth) {
		res.redirect("/courses");
	} else {
		var data = {
			title: "RateMyCourse"
		};

		res.render('register', data);
	}
});

router.post("/", async (req, res) => {
	const username = req.body.username;
	const password = req.body.password;

	var user = await userData.createUser(username, req.body.firstName, req.body.lastName, password);

	var data = {
		title: "RateMyCourse",
		error: "Issue registering user, please try again."
	}

	if(user) {
		try {
			auth = await userData.checkCredentials(username, password);
		} catch (e) {
			auth = false
		}

		if(auth) {
			var sessionID = await sessionsData.newSession(username);

			res.cookie("AuthCookie", sessionID);
			res.redirect("/courses");
		} else {
			res.render("register", data);
		}
	} else {
		res.render("register", data);
	}
});

module.exports = router;
