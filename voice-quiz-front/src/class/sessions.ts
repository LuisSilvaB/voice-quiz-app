
interface Session {
    created_at: Date;
    transcription?: string;
    COURSE_ID?: string;
    USER_ID?: string;
    model?: string;
    fragments_count?: number;
    ID: string;
    title:string; 
}

class SessionClass implements Session {
    created_at: Date;
    transcription?: string;
    COURSE_ID?: string;
    USER_ID?: string;
    model?: string;
    fragments_count?: number;
    ID: string;
    title: string;

    constructor(sessionData: Session) {
        this.created_at = sessionData.created_at;
        this.transcription = sessionData.transcription;
        this.COURSE_ID = sessionData.COURSE_ID;
        this.USER_ID = sessionData.USER_ID;
        this.model = sessionData.model;
        this.fragments_count = sessionData.fragments_count;
        this.ID = sessionData.ID;
        this.title = sessionData.title;
    }
}

export { type Session }
export default SessionClass;