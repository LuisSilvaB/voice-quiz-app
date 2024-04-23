type State = 'active' | 'inactive';

export class User {
    ID: string; 
    name:string; 
    email:string;
    created_at:string
    config: JSON;
    password:string;
    img_url:string; 
    state:State; 
    constructor(ID: string, name: string, email: string, created_at: string, config: JSON, password: string, img_url:string, state:State){ 
        this.ID = ID;
        this.name = name;
        this.email = email;
        this.created_at = created_at;
        this.config = config;
        this.password = password;
        this.img_url = img_url;
        this.state = state;
    }     
}
