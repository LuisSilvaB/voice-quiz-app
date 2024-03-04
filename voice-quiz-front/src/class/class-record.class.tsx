import { ClassRecordShape, Session } from '../interface/types';

class ClassRecord implements ClassRecordShape{
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

export default ClassRecord;