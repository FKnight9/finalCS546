const express = require("express");
const router = express.Router();
const userData = require("../data/users");
const sessionsData = require("../data/sessions");

router.get("/", async (req, res) => {
	res.redirect("/");
});

router.post("/", async (req, res) => {
	const username = req.body.username;
	const password = req.body.password;

	var auth = false;
	var error_message = "Incorrect Username and/or Password!"

	try {
		auth = await userData.checkCredentials(username, password);
	} catch (e) {
		error_message = "Username and/or Password can't be empty!"
	}

	if(auth) {
		var sessionID = await sessionsData.newSession(username);

		res.cookie("AuthCookie", sessionID);
		res.redirect("/courses");

	} else {
		var data = {
			title: "RateMyCourse",
			error: error_message
		}

		res.render("index", data);
	}
});

module.exports = router;
