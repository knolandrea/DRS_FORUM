export interface Post {
    id:number;
    title:string;
    description:string;
    likes:number;
    dislikes:number;
    user:string;
    liked:boolean;
    disliked:boolean;
    user_id:number;
    notified:boolean;
    showComment:boolean;
    disableComment:boolean;

    isClosed:number;
    isDeleted:number;
    commentsNumber:number;


    
}