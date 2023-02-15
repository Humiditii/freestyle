import {Prop,Schema,SchemaFactory} from '@nestjs/mongoose';
import {Document} from 'mongoose';
import { Role } from '../../guard/interface/role.enum';


export type AuthDocument = Auth & Document;

@Schema()
export class Auth {
    @Prop({required:true})
    username:string

    @Prop()
    firstname:string

    @Prop()
    lastname:string
    
    @Prop({default:false})
    verified:boolean

    @Prop()
    email:string

    @Prop()
    password:string

    @Prop({default:Role.User})
    role:Role

    @Prop({default: new Date()})
    createdAt:Date

}


export const AuthSchema = SchemaFactory.createForClass(Auth)