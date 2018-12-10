const express = require("express");
const router = express.Router();
const sessionsData = require("../data/sessions");

router.get("/", async (req, res) => {
	const sid = req.cookies.AuthCookie;

	try {
		var auth = await sessionsData.getSession(sid) !== undefined;
	} catch(e) {
		var auth = false;
	}

	if(auth) {
		res.redirect("/private");
	} else {
		var data = {
			title: "Rate My Courses"
		};

		res.render('index', data);
	}
});

module.exports = router;
