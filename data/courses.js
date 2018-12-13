const mongoCollections = require("../config/mongoCollections");
const courses = mongoCollections.courses;

const commentsData = require("./comments");
const uuidv4 = require('uuid/v4');

function titleCase(str) {
  return str.toLowerCase().split(' ').map(function(word) {
    return (word.charAt(0).toUpperCase() + word.slice(1));
  }).join(' ');
}

async function createCourse(courseCode, courseName) {
    if ((!courseCode) || (typeof courseCode !== "string")) throw "Course Code is invalid";
    if ((!courseName) || (typeof courseName !== "string")) throw "Course Name is invalid";

    const courseCollection = await courses();

    let newCourse = {
        _id: uuidv4(),
        courseCode: courseCode.toUpperCase(),
        courseName: titleCase(courseName)
    }

    const insertedCourse = await courseCollection.insertOne(newCourse);
    if (insertedCourse.insertedCount === 0) throw "Could not add course";

    const course = await this.getCourseByID(newCourse._id);
    return course;
}

// Delete a course given ID
async function deleteCourse(id) {
    if ((!id) || (typeof id !== "string")) throw "ID is invalid";

    const courseComments = await commentsData.getCommentsByCourseID(id)

    for (var i = 0; i < courseComments.length; i++) {
      var user = await this.getUserByID(String(courseComments[i].userID))
      var sessionID = String(await sessionsData.newSession(user.username))
      await commentsData.deleteComment(sessionID, String(courseComments[i]._id))
      await sessionsData.expireSession(sessionID)
    }

    const courseCollection = await courses();
    const deletedCourse = await courseCollection.removeOne({_id: id});
    if (deletedCourse.deletedCount === 0) throw "Failed to remove this course with id of ${id}";
}

// Update details of a course
async function updateCourse(id, courseCode, courseName) {
    if ((!id) || (typeof id !== "string")) throw "ID is invalid";
    if ((!courseCode) || (typeof courseCode !== "string")) throw "Course Code is invalid";
    if ((!courseName) || (typeof courseName !== "string")) throw "Course Name is invalid";

    let course = await this.getCourse(id);
    course.courseCode = courseCode;
    course.courseName = courseName;

    const courseCollection = await courses();
    const updatedCourse = await courseCollection.replaceOne({_id: id}, course);

    if (updatedCourse.modifiedCount === 0) throw "Failed to update course";

    return await this.getCourseByID(id);
}

// Return all courses
async function getCourses() {
    const courseCollection = await courses();
    const foundCourses = await courseCollection.find({}, {_id: 1, courseCode: 1, courseName: 1}).toArray();
    return foundCourses;
}

// Find a course by id
async function getCourseByID(id) {
    if ((!id) || (typeof id !== "string")) throw "ID is invalid";

    const courseCollection = await courses();
    const foundCourse = await courseCollection.findOne({_id: id});

    if (foundCourse === null) return undefined;

    return foundCourse;
}

// Find a course by code
async function getCourseByCode(courseCode) {
    if ((!courseCode) || (typeof courseCode !== "string")) throw "Course Code is invalid";

    const courseCollection = await courses();
    const foundCourse = await courseCollection.findOne({courseCode: courseCode});

    if (foundCourse === null) return undefined;

    return foundCourse;
}

// Find a course by name
async function getCourseByName(courseName) {
    if ((!courseName) || (typeof courseName !== "string")) throw "Course Name is invalid";

    const courseCollection = await courses();
    const foundCourse = await courseCollection.findOne({courseName: courseName});

    if (foundCourse === null) return undefined;

    return foundCourse;
}

module.exports = {
  createCourse,
  deleteCourse,
  updateCourse,
  getCourses,
  getCourseByID,
  getCourseByCode,
  getCourseByName
};
