import { Role } from "src/guard/interface/role.enum"

export class SignupAuthDto {
    readonly firstname:string
    readonly lastname: string
    readonly username:string
    readonly email:string
    readonly role:Role
    password:string
}

export class SignInAuthDto {
    readonly email:string
    readonly password:string
}
