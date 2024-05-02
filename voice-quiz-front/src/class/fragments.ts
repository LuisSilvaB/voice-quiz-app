export interface Fragment{
    ID:string; 
    created_at?:string; 
    title:string; 
    content:string; 
    count_questions:number;
    COURSE_ID:string; 
    USER_ID:string; 
    SESSION_ID:string;  
}

export class FragmentClass implements Fragment {
    ID: string;
    created_at?: string;
    title: string;
    content: string;
    count_questions: number;
    COURSE_ID: string;
    USER_ID: string;
    SESSION_ID: string;

    constructor(ID: string, created_at: string, title: string, content: string, count_questions: number, COURSE_ID: string, USER_ID: string, SESSION_ID: string) {
        this.ID = ID;
        this.created_at = created_at;
        this.title = title;
        this.content = content;
        this.count_questions = count_questions;
        this.COURSE_ID = COURSE_ID;
        this.USER_ID = USER_ID;
        this.SESSION_ID = SESSION_ID;
    }
}