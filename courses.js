const mongoCollections = require("./mongoCollections");
const courses = mongoCollections.courses;
const Guid = require("guid");

module.exports = {
    // Create a course
    async createCourse(courseCode, courseName) {
        if (!courseCode) throw "Course Code is invalid";
        if (!courseName) throw "Course Name is invalid";

        const courseCollection = await courses();
        
        let newCourse = {
            _id: Guid.create().toString(),
            courseCode: courseCode,
            courseName: courseName
        }

        const insertedCourse = await courseCollection.insertOne(newCourse);
        if (insertedCourse.insertedCount === 0) throw "Could not add course";
        
        const course = await this.getCourse(insertedCourse.insertedId);
        return course;
    },
    // Delete a course given ID
    async deleteCourse(id) {
        if (!id) throw "ID is invalid";

        const courseCollection = await courses();
        const deletedCourse = await courseCollection.removeOne({_id: id});
        if (deletedCourse.deletedCount === 0) throw "Failed to remove this course with id of ${id}";
    },

    // Update details of a course
    async updateCourse(id, courseCode, courseName) {
        if (!id) throw "ID is invalid";
        if (!courseCode) throw "Course Code is invalid";
        if (!courseName) throw "Course Name is invalid";

        let course = await this.getCourse(id);
        course.courseCode = courseCode;
        course.courseName = courseName;

        const courseCollection = await courses();
        const updatedCourse = await courseCollection.replaceOne({_id: id}, course);
    
        if (updatedCourse.modifiedCount === 0) throw "Failed to update course";

        return await this.getCourse(id);
    },

    // Find a course by id
    async getCourse(id) {
        if (!id) throw "ID is invalid";

        const courseCollection = await courses();
        const foundCourse = await courseCollection.findOne({_id: id});

        if (foundCourse === null) throw "No course exists with that ID";
        
        return foundCourse;
    },
    // Find a course by code
    async getCourseByCode(courseCode) {
        if (!courseCode) throw "Course Code is invalid";

        const courseCollection = await courses();
        const foundCourse = await courseCollection.findOne({courseCode: courseCode});

        if (foundCourse === null) throw "No course exists with that Course Code";
        
        return foundCourse;
    },

    // Find a course by name
    async getCourseByName(courseName) {
        if (!courseName) throw "Course Name is invalid";

        const courseCollection = await courses();
        const foundCourse = await courseCollection.findOne({courseName: courseName});

        if (foundCourse === null) throw "No course exists with that Course Name";
        
        return foundCourse;
    }
};