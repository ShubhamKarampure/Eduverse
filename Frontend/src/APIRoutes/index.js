const host = "http://localhost:4000/api/v1/user"

export const signupRoute = `${host}/signup`
export const loginRoute = `${host}/login`
export const getAllCoursesByBranchRoute = `${host}/student/course/`
export const getAllCoursesByInstructor = `${host}/teacher/course/`
export const quizRoute = `${host}/teacher/course/get-course`
export const studentCourseEnrollment=`${host}/student/course`