import { User } from "./user";

export class Post{
    id: number;
    title:string;
    content:string;
    createdAt: Date;
    author: User[];
    pic: ArrayBuffer;
    mimetype: string;
}
