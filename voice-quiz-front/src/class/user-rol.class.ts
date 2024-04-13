export class UserRol {
    created_at: string;
    ROL_ID: string;
    USER_ID: string;
    constructor(created_at: string, ROL_ID: string, USER_ID: string) {
        this.created_at = created_at; 
        this.ROL_ID = ROL_ID;
        this.USER_ID = USER_ID;
    }
}
