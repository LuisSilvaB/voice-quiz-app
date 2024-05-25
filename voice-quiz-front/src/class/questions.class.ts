import { kindQuestion } from "../interface/types";

export interface Question {
    ID:string; 
    created_at:string; 
    question:string; 
    alternatives: string[]
    answer:string; 
    type:kindQuestion; 
    SESSION_ID:string; 
    COURSE_ID:string; 
    USER_ID:string; 
    FRAGMENT_ID:string; 
}

export interface Alternative{
    ID:string; 
    position:number;
    content:string;
    QUESTION_ID:string;
}

export interface Answer {
    ID:string;
    position:number;
    content:string;
    QUESTION_ID:string;
}

export class QuestionClass implements Question {
    ID: string;
    created_at: string;
    question: string;
    alternatives: string[];
    answer: string;
    type: kindQuestion;
    SESSION_ID: string;
    COURSE_ID: string;
    USER_ID: string;
    FRAGMENT_ID: string;

    constructor(ID: string, created_at: string, question: string, alternatives: string[], answer: string, type: kindQuestion, SESSION_ID: string, COURSE_ID: string, USER_ID: string, FRAGMENT_ID: string) {
        this.ID = ID;
        this.created_at = created_at;
        this.question = question;
        this.alternatives = alternatives;
        this.answer = answer;
        this.type = type;
        this.SESSION_ID = SESSION_ID;
        this.COURSE_ID = COURSE_ID;
        this.USER_ID = USER_ID;
        this.FRAGMENT_ID = FRAGMENT_ID;
    }
}

