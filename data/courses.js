const mongoCollections = require("../config/mongoCollections");
const courses = mongoCollections.courses;

const uuidv4 = require('uuid/v4');

async function createCourse(courseCode, courseName) {
    if ((!courseCode) || (typeof courseCode !== "string")) throw "Course Code is invalid";
    if ((!courseName) || (typeof courseName !== "string")) throw "Course Name is invalid";

    const courseCollection = await courses();

    let newCourse = {
        _id: uuidv4(),
        courseCode: courseCode,
        courseName: courseName
    }

    const insertedCourse = await courseCollection.insertOne(newCourse);
    if (insertedCourse.insertedCount === 0) throw "Could not add course";

    const course = await this.getCourse(insertedCourse.insertedId);
    return course;
}

// Delete a course given ID
async function deleteCourse(id) {
    if ((!id) || (typeof id !== "string")) throw "ID is invalid";

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

    return await this.getCourse(id);
}

// Find a course by id
async function getCourseByID(id) {
    if ((!id) || (typeof id !== "string")) throw "ID is invalid";

    const courseCollection = await courses();
    const foundCourse = await courseCollection.findOne({_id: id});

    if (foundCourse === null) throw "No course exists with that ID";

    return foundCourse;
}

// Find a course by code
async function getCourseByCode(courseCode) {
    if ((!courseCode) || (typeof courseCode !== "string")) throw "Course Code is invalid";

    const courseCollection = await courses();
    const foundCourse = await courseCollection.findOne({courseCode: courseCode});

    if (foundCourse === null) throw "No course exists with that Course Code";

    return foundCourse;
}

// Find a course by name
async function getCourseByName(courseName) {
    if ((!courseName) || (typeof courseName !== "string")) throw "Course Name is invalid";

    const courseCollection = await courses();
    const foundCourse = await courseCollection.findOne({courseName: courseName});

    if (foundCourse === null) throw "No course exists with that Course Name";

    return foundCourse;
}

module.exports = {
  createCourse,
  deleteCourse,
  updateCourse,
  getCourseByID,
  getCourseByCode,
  getCourseByName
};