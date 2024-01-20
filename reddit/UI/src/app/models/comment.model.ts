export interface Comment {
    id:number;
    desc:string;
    likes:number;
    dislikes:number;
    user:string;
    topic:string;
    liked:boolean;
    disliked:boolean;
    user_id:number;
    topic_id:number;
}
