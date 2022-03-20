import { User } from "./user";

export class Post{
    id: number;
    title:string;
    content:string;
    createdAt: Date;
    updatedAt: Date;
    name: string;
    author: User[];
    pic: ArrayBuffer;
    mimetype: string;
    userId: number;
}
