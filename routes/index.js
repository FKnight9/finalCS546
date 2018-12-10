const mainRoute = require("./main");
const privateRoute = require("./private");
const registerRoute = require("./register");
const loginRoute = require("./login");
const logoutRoute = require("./logout");

function constructorMethod(app) {
	app.use("/", mainRoute);
	app.use("/private", privateRoute);
	app.use("/register", registerRoute);
	app.use("/login", loginRoute);
	app.use("/logout", logoutRoute);

	app.use("*", (req, res) => {
		var data = {
			title: "Error 404",
			description: "Page could not be found."
		}

		res.status(404).render("error", data);
	});
};

module.exports = constructorMethod;
