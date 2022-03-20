import { Post } from "./post";

export class Comment
{   id: number;
    content: string;
    createdAt: Date;
    postId: number;
}
