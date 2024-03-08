import { CourseShape, Session } from '../interface/types';

class CourseClass implements CourseShape{
    id: string;
    createAt: string;
    placeholderImg: string;
    sessions: Session[];
    title: string;
    constructor(id:string, createAt:string, placeholderImg:string, sessions:Session[], title:string) {
        this.id = id;
        this.createAt = createAt;
        this.placeholderImg = placeholderImg;
        this.sessions = sessions;
        this.title = title;
    }
}

export default CourseClass;