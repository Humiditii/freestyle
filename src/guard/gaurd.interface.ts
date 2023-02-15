import {Role} from '../guard/interface/role.enum';

export interface JwtPayload {
    readonly userId:string,
    readonly role: Role
}