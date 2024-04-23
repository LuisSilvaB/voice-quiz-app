interface Requirement {
    name: string;
    description: string;
}

interface Course {
    created_at: Date;
    description?: string;
    title?: string;
    duration?: string;
    requirements?: Requirement[];
    teacher_name?: string;
    students_count?: number;
    sessions_count?: number;
    initial_date?: string;
    final_date?: string;
    user_id?: string | null;
    ID: string;
}

class CourseClass implements Course {
    created_at: Date;
    description?: string;
    title?: string;
    duration?: string;
    requirements?: Requirement[];
    teacher_name?: string;
    students_count?: number;
    sessions_count?: number;
    initial_date?: string;
    final_date?: string;
    user_id?: string | null;
    ID: string;

    constructor(courseData: Course) {
        this.created_at = courseData.created_at;
        this.description = courseData.description;
        this.title = courseData.title;
        this.duration = courseData.duration;
        this.requirements = courseData.requirements;
        this.teacher_name = courseData.teacher_name;
        this.students_count = courseData.students_count;
        this.sessions_count = courseData.sessions_count;
        this.initial_date = courseData.initial_date;
        this.final_date = courseData.final_date;
        this.user_id = courseData.user_id;
        this.ID = courseData.ID;
    }
}

export { type Course }
export default CourseClass;