import AbstractRepository from "../../abstract.repository";
import { IPost } from "../../../utilities";
import { Post } from "./post.model";

export class PostRepository extends AbstractRepository<IPost> {
    constructor() {
        super(Post)
    }  
}