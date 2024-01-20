export interface User {
    
    firstName:string;
    lastName:string;
    address:string;
    country:string;
    interests:[];
    
    username: string;
    password: string;
    email:string;
    phoneNumber:string;
    likedTopic:[];
    unlikedTopic:[];

}

export interface User_login{
    email: string;
    password: string;
}



