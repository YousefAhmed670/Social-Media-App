import { IUser } from "../../../utilities/common/interface";
import AbstractRepository from "../../abstract.repository";
import { User } from "./user.model";

export class UserRepository extends AbstractRepository<IUser> {
    constructor(){
        super(User)
    }
}