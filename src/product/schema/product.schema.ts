import {Prop,Schema,SchemaFactory} from '@nestjs/mongoose';
import {Document} from 'mongoose';
import { Role } from '../../guard/interface/role.enum';


export type ProductDocument = Product & Document;

@Schema()
export class Product {

    @Prop({required:true})
    adminId:string

    @Prop({required:true})
    productName:string

    @Prop()
    productDesc:string

    @Prop({required:true})
    productPrice:number
    
    @Prop({default: 1})
    productQuantity:number

    @Prop()
    productRating:number

    @Prop()
    productImage:string

    @Prop()
    productCategory:string

    @Prop({default: new Date()})
    createdAt:Date

    @Prop({default: new Date()})
    updatedAt:Date

}


export const ProductSchema = SchemaFactory.createForClass(Product)