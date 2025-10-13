import { IBlackListToken } from "../../../utilities";
import AbstractRepository from "../../abstract.repository";
import { Token } from "./token.model";

export class TokenRepository extends AbstractRepository<IBlackListToken> {
    constructor(){
        super(Token)
    }
}