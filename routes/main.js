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
		res.redirect("/courses");
	} else {
		var data = {
			title: "RateMyCourse"
		};

		res.render('index', data);
	}
});

module.exports = router;
