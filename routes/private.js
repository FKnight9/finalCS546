const express = require("express");
const router = express.Router();
const sessionsData = require("../data/sessions");

router.get("/", async (req, res) => {
	const AuthCookie = req.cookies.AuthCookie;

	var user = await sessionsData.getSession(AuthCookie);
	var auth = (user !== undefined);

	if(auth) {
		data = {
			title: "User Details",
			user: user
		}

		res.render("private", data);
	} else {
		var data = {
			title: "Error 403",
			description: "No user is currently logged in."
		}

		res.status(403).render("error", data);
	}
});

module.exports = router;
