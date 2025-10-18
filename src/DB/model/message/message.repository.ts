import AbstractRepository from "../../abstract.repository";
import { IChatMessage } from "../../../utilities";
import { Message } from "./message.model";

export class MessageRepository extends AbstractRepository<IChatMessage> {
    constructor(){
        super(Message)
    }
}