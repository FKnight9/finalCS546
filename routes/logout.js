const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
	var data = {
		title: "Logout"
	}

	const AuthCookie = req.cookies.AuthCookie;
	const sessionsData = require("../data/sessions");

	res.cookie("AuthCookie", "", {expires: new Date()});
	res.clearCookie("AuthCookie");
	sessionsData.expireSession(AuthCookie);
	res.render("logout", data);
});

module.exports = router;
