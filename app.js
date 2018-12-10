/*const users = require("./users");
const courses = require("./courses");
const comments = require("./comments");

const main = async () => {

    // console.log(await comments.createComment("1", "10", "First comment"));
    // console.log(await comments.createComment("1", "20", "Second comment"));
    // console.log(await comments.createComment("2", "10", "Third comment"));
    // console.log(await comments.createComment("2", "30", "Fourth comment"));

    console.log(await comments.getCommentsByCourseID("1"));

}

main().catch(error => {
    console.log(error);
});*/

const express = require("express");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const configRoutes = require("./routes");

const app = express();

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:3000");

  //if (process && process.send) process.send({done: true});
});
