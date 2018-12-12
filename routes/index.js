const mainRoute = require("./main");

const courseRoute = require("./course");
const coursesRoute = require("./courses");

const registerRoute = require("./register");
const loginRoute = require("./login");
const logoutRoute = require("./logout");

function constructorMethod(app) {
	app.use("/", mainRoute);

	app.use("/register", registerRoute);
	app.use("/login", loginRoute);
	app.use("/logout", logoutRoute);

	app.use("/courses", coursesRoute);
	app.use("/courses/*", courseRoute);

	app.use("*", (req, res) => {
		var data = {
			title: "Error 404",
			description: "Page could not be found."
		}

		res.status(404).render("error", data);
	});
};

module.exports = constructorMethod;
