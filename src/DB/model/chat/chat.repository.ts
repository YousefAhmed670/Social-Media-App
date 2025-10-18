import AbstractRepository from "../../abstract.repository";
import { IChat } from "../../../utilities";
import { Chat } from "./chat.model";

export class ChatRepository extends AbstractRepository<IChat> {
    constructor(){
        super(Chat)
    }
}